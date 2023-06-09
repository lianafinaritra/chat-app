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
import {RefObject, useState} from "react";
import {useForm} from "react-hook-form";
import {useAuthStore} from "@/services/stores/auth-store";
import {authProvider} from "@/services/providers/auth-provider";
import {useChannelStore} from "@/services/stores/channel-store";
import {useMessageStore} from "@/services/stores/message-store";
import {channelProvider} from "@/services/providers/channel-provider";
import Select, {MultiValue} from 'react-select';
import {User} from "@/services/types";

interface ChannelMemberProps {
    initialRef: RefObject<FocusableElement>;
    finalRef: RefObject<FocusableElement>;
    isOpen: boolean;
    onClose: () => void;
}

export const ChannelMemberModal = ({ initialRef, finalRef, isOpen, onClose }: ChannelMemberProps) => {
    const { user, allUsers } = useAuthStore();
    const { channel } = useChannelStore();

    const onSubmit = () => {
        const selectedUserIds = selectedUsers.map((user) => user.id);
        /*const addNewMember = async () => {
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
        addNewMember();*/
        console.log(selectedUserIds);
    };

    const [selectedUsers, setSelectedUsers] = useState<MultiValue<User>>([]);

    const transformName = (users: User[]) => {
        return users.map((user) => ({
            value: user.id,
            label: user.name,
        }));
    };

    const handleUserSelection = (selectedOptions: MultiValue<User>) => {
        setSelectedUsers(selectedOptions);
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
                            <Select
                                options={transformName(allUsers)}
                                getOptionLabel={(option) => `${option.name}`}
                                value={selectedUsers}
                                onChange={(users) => handleUserSelection(users)}
                                isMulti
                            />
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='teal' mr={3} onClick={onSubmit}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}