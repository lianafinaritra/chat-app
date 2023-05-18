import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
} from '@chakra-ui/react'
import {FocusableElement} from "@chakra-ui/utils";
import {RefObject} from "react";
import {CreateChannel} from "@/services/types/channel";
import {useForm} from "react-hook-form";
import {channelProvider} from "@/services/providers/channel-provider";
import {useAuthStore} from "@/services/stores/auth-store";
import {useChannelStore} from "@/services/stores/channel-store";

interface ChannelMemberProps {
    initialRef: RefObject<FocusableElement>;
    finalRef: RefObject<FocusableElement>;
    isOpen: boolean;
    onClose: () => void;
}

export const ChannelMemberModal = ({ initialRef, finalRef, isOpen, onClose }: ChannelMemberProps) => {
    const { allUsers } = useAuthStore();
    const formDefaultValues  = {
        members: []
    };
    const { register, handleSubmit, reset } = useForm({
        defaultValues: formDefaultValues
    });

    const onSubmit = (infos: {members: string[]}) => {
        console.log(infos);
        reset();
    };

    return(
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Ajouter</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <div className="relative z-0 w-4/5 mx-auto mb-7 group">
                        <div className="relative">
                            <select
                                className="block py-2.5 px-0 w-full text-sm text-gray-400 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-600 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                id="grid-state" required {...register('members')} value={JSON.stringify(formDefaultValues.members)}>
                                {allUsers.map((user) => (
                                    <option key={user.id} value={[user.id.toString()]}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='teal' mr={3} onClick={handleSubmit(onSubmit)}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}