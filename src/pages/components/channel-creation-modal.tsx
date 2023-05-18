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

interface ChannelCreationProps {
    initialRef: RefObject<FocusableElement>;
    finalRef: RefObject<FocusableElement>;
    isOpen: boolean;
    onClose: () => void;
}

export const ChannelCreationModal = ({ initialRef, finalRef, isOpen, onClose }: ChannelCreationProps) => {
    const { user } = useAuthStore();
    const { setChannels } = useChannelStore();
    const formDefaultValues: CreateChannel = {
        name: '',
        type: 'public',
        members: []
    };
    const { register, handleSubmit, formState } = useForm<CreateChannel>({
        defaultValues: formDefaultValues
    });
    const validateType = (value: string) => {
        return value === 'public' || value === 'private' || 'Le champ "type" est requis';
    };

    const onSubmit = (infos: CreateChannel) => {
        const submit = async () => {
            if (user && user.token) {
            const { check } = await channelProvider.createChannel( user?.token ,infos);
            if (check) {
                console.log('Channel ajouté avec succés');
                const { data } = await channelProvider.getAllChannels( user?.token);
                setChannels(data);
                console.log(data);
            } else {
                console.error('Failed to create channel');
            }
            }
        };
       submit();
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
                <ModalHeader>Create your Channel</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <div className="relative z-0 w-3/5 mx-auto mb-7 group">
                        <input type="email" id="floating_email"
                               className="block py-2.5 px-0 w-full text-sm text-gray-400 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-600 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                               placeholder=" " required {...register('name')}/>
                        <label htmlFor="floating_email"
                               className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Name
                        </label>
                    </div>
                    <div className="relative z-0 w-3/5 mx-auto mb-7 group">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="grid-state">
                            Type
                        </label>
                        <div className="relative">
                            <select
                                className="block py-2.5 px-0 w-full text-sm text-gray-400 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-600 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                id="grid-state" required {...register('type', { validate: validateType })}>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                    </div>
                    <input type="hidden" {...register('members')} value={JSON.stringify(formDefaultValues.members)} />
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleSubmit(onSubmit)}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}