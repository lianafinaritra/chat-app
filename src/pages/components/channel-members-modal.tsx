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
import {useForm} from "react-hook-form";
import {useAuthStore} from "@/services/stores/auth-store";
import {authProvider} from "@/services/providers/auth-provider";
import {useChannelStore} from "@/services/stores/channel-store";
import {useMessageStore} from "@/services/stores/message-store";
import {channelProvider} from "@/services/providers/channel-provider";

interface ChannelMemberProps {
    initialRef: RefObject<FocusableElement>;
    finalRef: RefObject<FocusableElement>;
    isOpen: boolean;
    onClose: () => void;
}

export const ChannelMemberModal = ({ initialRef, finalRef, isOpen, onClose }: ChannelMemberProps) => {
    const { user, allUsers } = useAuthStore();
    const { channel } = useChannelStore();

    const formDefaultValues  = {
        members: []
    };

    const { register, handleSubmit, reset } = useForm({
        defaultValues: formDefaultValues
    });

    const onSubmit = (infos: {members: string[]}) => {
        const addNewMember = async () => {
            if (user && user.token && channel) {
                const {check} = await channelProvider.addMember(user.token, channel?.id, infos);
                if (check) {
                    reset();
                    console.log('Opération réussi');
                } else {
                    console.error('Failed to add member');
                }
            }
        };
        addNewMember();
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