import {useAuthStore} from "@/services/stores/auth-store";
import {useChannelStore} from "@/services/stores/channel-store";
import {useMessageStore} from "@/services/stores/message-store";
import {
  Button,
  Drawer, DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay, Input,
  Text,
  useDisclosure, useToast
} from "@chakra-ui/react";
import {MouseEventHandler, useEffect, useRef} from "react";
import {Avatar, AvatarGroup} from "@chakra-ui/avatar";
import {useForm} from "react-hook-form";
import {channelProvider} from "@/services/providers/channel-provider";
import {messageProvider} from "@/services/providers/message-provider";
import Head from "next/head";
import chat from "@/styles/Chat.module.css";
import {inter} from "@/pages/_app";
import {AiOutlineMenu, AiOutlineMessage, AiOutlineSend, AiOutlineUserAdd} from "react-icons/ai";
import {BsInfoSquare} from "react-icons/bs";
import {TbLogout} from "react-icons/tb";
import {palette} from "@/theme/palette";
import {useRouter} from "next/router";
import {logout} from "@/pages/utils/logout";
import {CardMessage, CardMessageSender} from "@/pages/components/card-message";
import {BiAddToQueue} from "react-icons/bi";
interface ChanelAvatarProps {
  text: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

const ChannelID = () => {
  const toast = useToast();
  const router = useRouter();
  const { channelID } = router.query;
  const id = Array.isArray(channelID) ? channelID[0] : channelID;
  const { user, setUsers } = useAuthStore();
  const { channel ,allChannels, setChannel, setChannels } = useChannelStore();
  const { allMessages ,setMessages } = useMessageStore();
  const { push}= useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const showChannel = async () => {
      if (token) {
        if (user && user.token && id) {
          const {data, check} = await channelProvider.getChannel(user.token, id.toString());
          if (check) {
            setChannel(data);
            const {data: messages} = await messageProvider.getAllMessagesByChannel(user.token, data.id);
            setMessages(messages);
            const {data: channels} = await channelProvider.getAllChannels(user.token);
            setChannels(channels);
            console.log('Opération réussi');
          } else {
            console.error('Failed to get channel');
          }
        }
      } else {
        await push('/login');
      }
    };
    showChannel();

    const interval = setInterval(showChannel, 3000);
    return () => clearInterval(interval);
  }, [push]);

  const { isOpen: openDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure()

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

  const formDefaultValues = {
    message: ''
  };

  const { register, handleSubmit, reset } = useForm({
    defaultValues: formDefaultValues
  });

  const onSubmit = (infos: {message: string}) => {
    const createMessage = async () => {
      if (user && user.token && channel) {
        console.log(infos)
        const {check} = await messageProvider.createMessage(user.token, {content: infos.message, channelId: channel.id, recipientId: null});
        if (check) {
          reset();
          toast({
            title: 'Ajouté avec success',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          const {data} = await messageProvider.getAllMessagesByChannel(user?.token, channel?.id);
          setMessages(data);
          console.log(data);
        } else {
          toast({
            title: 'Erreur',
            description: 'Veuillez réessayez plus tard',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
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
          <div className={chat.navbar}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '200px', height: '100%', marginLeft: '20px' }}>
              <div style={{ width: '40%', display: 'flex', justifyContent: 'center' }}>
                <Button colorScheme='teal' variant='solid' onClick={onOpenDrawer}>
                  <AiOutlineMenu/>
                </Button>
                <Drawer placement={'left'} onClose={onCloseDrawer} isOpen={openDrawer}>
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>Compte</DrawerHeader>
                    <DrawerBody>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBlock: '20px'}}>
                        <Button colorScheme='teal' variant='solid' onClick={() => router.push('/channel/create')}>
                          <BiAddToQueue/>
                        </Button>
                        <Text fontSize='l' color='teal' style={{ marginLeft: '20px' }}>Créer un nouveau groupe</Text>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBlock: '20px'}}>
                        <Button colorScheme='teal' variant='solid' onClick={() => router.push('/message/1')}>
                          <AiOutlineMessage/>
                        </Button>
                        <Text fontSize='l' color='teal' style={{ marginLeft: '20px' }}>Message Privée</Text>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBlock: '20px'}}>
                        <Button colorScheme='teal' variant='solid' onClick={() => router.push('/profile')}>
                          <BsInfoSquare/>
                        </Button>
                        <Text fontSize='l' color='teal' style={{ marginLeft: '20px' }}>{"Informations d'utilisateurs"}</Text>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBlock: '20px'}}>
                        <Button colorScheme='teal' variant='solid' onClick={logout}>
                          <TbLogout/>
                        </Button>
                        <Text fontSize='l' color='teal' style={{ marginLeft: '20px' }}>Déconnexion</Text>
                      </div>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </div>
              <Text color='white'>Mamaly.io</Text>
            </div>
            <div style={{ marginLeft: 550 }}>
              <Text color='white' width={300}>MESSAGES DE GROUPES</Text>
            </div>
            <div style={{ marginLeft: 400 }}>
              <Button colorScheme='teal' variant='solid' onClick={logout}>
                <TbLogout/>
              </Button>
            </div>
          </div>
          <div className={chat.all}>
            <div className={chat.avatar}>
              <AvatarGroup style={{ flexDirection: 'column', alignItems: 'flex-start', paddingTop: '10px' }}>
                {allChannels.map(channel => (
                    <ChanelAvatar key={channel.id} text={channel.name} onClick={async () => {
                      await push('/channel/'+channel.id);
                    }
                    }/>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBlock: 5 }}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <Text fontSize='lg' color='teal'>Groupes</Text>
                  </div>
                </div>
              </AvatarGroup>
            </div>
            <div className={chat.container}>
              <div style={{ width: '100%', height: 70, borderBottomWidth: '1px', borderColor: palette.primaryPurple, display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                <div style={{ width: '85%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                  <Text fontSize='2xl' color='white'>{channel?.name}</Text>
                </div>
                <Button colorScheme='teal' variant='solid' style={{ width: 70, marginInline: 30 }} onClick={async () => {
                  await push('/channel/edit/'+channel?.id)
                }
                }>
                  <AiOutlineUserAdd />
                </Button>
              </div>
              <div style={{ width: '100%', height: 590, display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {allMessages.slice().reverse().map(message => (
                        message.sender.id == user?.id ?
                            <CardMessageSender key={message.id} message={message}/> :
                            <CardMessage key={message.id} message={message} />
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ width: '100%',height: 70, display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                <Input color='teal' type='email' focusBorderColor='teal' style={{ backgroundColor: 'white', marginLeft: 30 }} required {...register("message")}/>
                <Button className="sendMessageButton" colorScheme='teal' variant='solid' style={{ width: 70, marginInline: 30 }} onClick={handleSubmit(onSubmit)}>
                  <AiOutlineSend />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </>
  )
};

export default ChannelID;
