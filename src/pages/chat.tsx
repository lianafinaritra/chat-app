import Head from "next/head";
import chat from "@/styles/Chat.module.css";
import {inter} from "@/pages/_app";
import {Avatar, AvatarGroup} from "@chakra-ui/avatar";
import {Text, Button, Icon, useDisclosure} from '@chakra-ui/react'
import {useAuthStore} from "@/services/stores/auth-store";
import {AddIcon} from "@chakra-ui/icons";
import {palette} from "@/theme/palette";
import { AiOutlineUserAdd, AiOutlineSend, AiOutlineReload } from 'react-icons/ai';
import {MouseEventHandler, useRef} from "react";
import {ChannelCreationModal} from "@/pages/components/channel-creation-modal";
import {useChannelStore} from "@/services/stores/channel-store";
import {channelProvider} from "@/services/providers/channel-provider";
import {authProvider} from "@/services/providers/auth-provider";
import {ChannelMemberModal} from "@/pages/components/channel-members-modal";
import {messageProvider} from "@/services/providers/message-provider";
import {useMessageStore} from "@/services/stores/message-store";
import { Card, CardBody, Input } from '@chakra-ui/react'
import {useForm} from "react-hook-form";

interface ChanelAvatarProps {
    text: string;
    onClick: MouseEventHandler<HTMLDivElement>;
}

interface CardMessageProps {
    sender: string
    text: string;
}

export default function Chat() {
    const { user, setUsers } = useAuthStore();
    const { channel ,allChannels, setChannel, setChannels } = useChannelStore();
    const { allMessages ,setMessages } = useMessageStore();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: openMember, onOpen: onOpenMember, onClose: onCloseMember } = useDisclosure();

    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const initialMemberRef = useRef(null)
    const finalMemberRef = useRef(null)

    const ChanelAvatar = ({ text, onClick }: ChanelAvatarProps) => {
        return(
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBlock: 5 }} onClick={onClick}>
                <div style={{ width: '30%', display: 'flex', justifyContent: 'center' }}>
                    <Avatar bg='teal.500' style={{marginBlock: '5px'}} />
                </div>
                <div style={{ width: '70%', display: 'flex', paddingLeft: 30 }}>
                    <Text fontSize='sm' color='white'>{text}</Text>
                </div>
            </div>
            )
    }

    const CardMessage= ({ text, sender }: CardMessageProps) => {
        return(
            <>
            <Text color='white' fontSize='sm' style={{ marginRight: 20, marginTop: 10 }}>{sender}</Text>
            <Card style={{ borderRadius: 10, borderWidth: 2, borderColor: 'red', backgroundColor: 'transparent', width: '40%', height: 50, justifyContent: 'center', marginRight: 20, marginBottom: 10}}>
                <CardBody style={{ backgroundColor: 'transparent' }}>
                    <Text color='white'>{text}</Text>
                </CardBody>
            </Card>
            </>
        )
    }

    const formDefaultValues = {
        content: ''
    };

    const { register, handleSubmit, reset } = useForm({
        defaultValues: formDefaultValues
    });

    const showChannel = async (id: string) => {
        if (user && user.token) {
            const {data, check} = await channelProvider.getChannel(user?.token, id);
            if (check) {
                setChannel(data);
                if(channel){
                    const {data: messages} = await messageProvider.getAllMessagesByChannel(user?.token, channel?.id);
                    setMessages(messages);
                    console.log('Opération réussi');
                }
            } else {
                console.error('Failed to get channel');
            }
        }
    };

    const showUsers = async () => {
        if (user && user.token) {
            const {data, check} = await authProvider.getAllUsers(user.token);
            if (check) {
                setUsers(data);
                console.log('Opération réussi');
            } else {
                console.error('Failed to create channel');
            }
        }
        onOpenMember();
    }

    const getAllChannels = async () => {
        if (user && user.token) {
            const { data, check } = await channelProvider.getAllChannels( user?.token);
            if (check) {
                setChannels(data);
                console.log('Channel ajouté avec succés');
                reset();
            } else {
                console.error('Failed to create channel');
            }
        }
    }

    const getAllMessages = async () => {
        if (user && user.token && channel) {
            const {data, check} = await messageProvider.getAllMessagesByChannel(user?.token, channel?.id);
            if (check) {
                setMessages(data);
                console.log('Opération réussi');
            } else {
                console.error('Failed to create channel');
            }
        }
    }
    const onSubmit = (infos: {content: string}) => {
        const createMessage = async () => {
            if (user && user.token && channel) {
                console.log(infos)
                const {check} = await messageProvider.createMessage(user.token, {...infos, channelId: channel.id, recipientId: null});
                if (check) {
                    reset();
                    const {data} = await messageProvider.getAllMessagesByChannel(user?.token, channel?.id);
                    setMessages(data);
                    console.log(data);
                } else {
                    console.error('Failed to create channel');
                }
            }
        }
        createMessage();
    };

    return(
        <>
            <Head>  
                <title>Chat</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={`${chat.main} ${inter.className}`}>
                <div className={chat.avatar}>
                    <AvatarGroup style={{ flexDirection: 'column', alignItems: 'flex-start', paddingTop: '10px' }}>
                        {allChannels.map(channel => (
                            <ChanelAvatar key={channel.id} text={channel.name} onClick={() => showChannel(channel.id)}/>
                        ))}
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBlock: 5 }}>
                            <div style={{ width: '30%', display: 'flex', justifyContent: 'center' }}>
                                <Button colorScheme='teal' variant='solid' onClick={onOpen}>
                                    <Icon as={AddIcon} />
                                </Button>
                                <ChannelCreationModal
                                    initialRef={initialRef}
                                    finalRef={finalRef}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                />
                            </div>
                            <div style={{ width: '30%', display: 'flex', justifyContent: 'center' }}>
                                <Button colorScheme='teal' variant='solid' onClick={() => getAllChannels()}>
                                    <AiOutlineReload/>
                                </Button>
                            </div>
                        </div>
                    </AvatarGroup>
                </div>
                <div className={chat.container}>
                    <div style={{ width: '100%', height: 70, borderBottomWidth: '1px', borderColor: palette.primaryPurple, display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <div style={{ width: '85%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                            <Text fontSize='lg' color='white'>{channel?.name}</Text>
                        </div>
                        <Button colorScheme='teal' variant='solid' style={{ width: 70, marginInline: 30 }} onClick={() => showUsers()}>
                            <AiOutlineUserAdd />
                        </Button>
                        <Button colorScheme='teal' variant='solid' onClick={() => getAllMessages()}>
                            <AiOutlineReload/>
                        </Button>
                        <ChannelMemberModal
                            initialRef={initialMemberRef}
                            finalRef={finalMemberRef}
                            isOpen={openMember}
                            onClose={onCloseMember}
                        />
                    </div>
                    <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ width: '100%', flex: 1, overflow: 'auto' }}>
                            <div style={{ height: '90%', display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                                {allMessages.map(message => (
                                    <CardMessage key={message.id} text={message.content} sender={message.sender.name}/>
                                ))}
                            </div>
                        </div>
                        <div style={{ height: '10%', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                            <Input color='teal' type='email' focusBorderColor='teal' style={{ backgroundColor: 'white', marginLeft: 30 }} required {...register("content")}/>
                            <Button colorScheme='teal' variant='solid' style={{ width: 70, marginInline: 30 }} onClick={handleSubmit(onSubmit)}>
                                <AiOutlineSend />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={chat.info}>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', paddingBlock: 10, marginTop: 100}}>
                        <Avatar bg='teal.500' size="2xl"/>
                    </div>
                    <Text fontSize='2xl' color='white'>{user?.name}</Text>
                </div>
            </main>
        </>
    )
}