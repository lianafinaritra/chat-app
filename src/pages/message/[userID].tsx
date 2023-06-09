import {useAuthStore} from "@/services/stores/auth-store";
import {useChannelStore} from "@/services/stores/channel-store";
import {useMessageStore} from "@/services/stores/message-store";
import {
  Button,
  Card,
  CardBody,
  Drawer, DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay, Icon, Input,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import {MouseEventHandler, useEffect, useRef} from "react";
import {Avatar, AvatarGroup} from "@chakra-ui/avatar";
import {useForm} from "react-hook-form";
import {channelProvider} from "@/services/providers/channel-provider";
import {messageProvider} from "@/services/providers/message-provider";
import {authProvider} from "@/services/providers/auth-provider";
import Head from "next/head";
import chat from "@/styles/Chat.module.css";
import {inter} from "@/pages/_app";
import {AiOutlineMenu, AiOutlineReload, AiOutlineSend, AiOutlineUserAdd} from "react-icons/ai";
import {router} from "next/client";
import {TiArrowBack} from "react-icons/ti";
import {HiOutlineUserGroup} from "react-icons/hi";
import {BsInfoSquare} from "react-icons/bs";
import {TbLogout} from "react-icons/tb";
import {AddIcon} from "@chakra-ui/icons";
import {ChannelCreationModal} from "@/pages/components/channel-creation-modal";
import {palette} from "@/theme/palette";
import {ChannelMemberModal} from "@/pages/components/channel-members-modal";
import {Channel} from "@/services/types/channel";
import {GetServerSideProps} from "next";
import {useRouter} from "next/router";
import {User} from "@/services/types";
interface ChanelAvatarProps {
  text: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

interface CardMessageProps {
  sender: string
  text: string;
}

const UserID = () => {
  const router = useRouter();
  const { userID } = router.query;
  const id = Array.isArray(userID) ? userID[0] : userID;
  const { user, setUsers, allUsers } = useAuthStore();
  const { channel , friend, setFriend } = useChannelStore();
  const { allMessages ,setMessages } = useMessageStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: openMember, onOpen: onOpenMember, onClose: onCloseMember } = useDisclosure();
  const { isOpen: openDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure()

  const initialRef = useRef(null)
  const finalRef = useRef(null)
  const initialMemberRef = useRef(null)
  const finalMemberRef = useRef(null)

  useEffect(() => {
    const getAllMessages = async () => {
      if (user && user.token && id) {
        const {data, check} = await messageProvider.getAllMessagesByUser(user?.token, id.toString());
        if (check) {
          setMessages(data);
          console.log('Opération réussi');
        } else {
          console.error('Failed to get Messages');
        }
      }
    };
    getAllMessages();
  }, []);

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

  const CardMessageSender= ({ text, sender }: CardMessageProps) => {
    return(
        <>
          <Text color='white' fontSize='sm' style={{ marginLeft: 1150, marginTop: 10 }}>{sender}</Text>
          <Card style={{ borderRadius: 10, borderWidth: 2, borderColor: 'red', backgroundColor: 'transparent', width: '40%', height: 50, justifyContent: 'center', marginLeft: 750, marginBottom: 10}}>
            <CardBody style={{ backgroundColor: 'transparent' }}>
              <Text color='white'>{text}</Text>
            </CardBody>
          </Card>
        </>
    )
  }

  const CardMessage= ({ text, sender }: CardMessageProps) => {
    return(
        <>
          <Text color='white' fontSize='sm' style={{ marginLeft: 50, marginTop: 10 }}>{sender}</Text>
          <Card style={{ borderRadius: 10, borderWidth: 2, borderColor: 'red', backgroundColor: 'transparent', width: '40%', height: 50, justifyContent: 'center', marginLeft: 30, marginBottom: 10}}>
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

  const showUsers = async () => {
    if (user && user.token) {
      const {data, check} = await authProvider.getAllUsers(user.token);
      if (check) {
        setUsers(data);
        console.log('Opération réussi');
      } else {
        console.error('Failed to get Users');
      }
    }
    onOpenMember();
  }

  const getAllMessages = async () => {
    if (user && user.token && friend) {
      const {data, check} = await messageProvider.getAllMessagesByUser(user?.token, friend.id.toString());
      if (check) {
        setMessages(data);
        console.log('Opération réussi');
      } else {
        console.error('Failed to get Messages');
      }
    }
  }
  const showFriend = async (newFriend: User) => {
    if (newFriend && user && user.token) {
      setFriend(newFriend);
      const {data: messages} = await messageProvider.getAllMessagesByChannel(user.token, newFriend.id.toString());
      setMessages(messages);
      console.log('Opération réussi');
    }
  };

  const onSubmit = (infos: {content: string}) => {
    const createMessage = async () => {
      if (user && user.token && friend) {
        console.log(infos)
        const {check} = await messageProvider.createMessage(user.token, {...infos, channelId: null, recipientId: friend.id.toString()});
        if (check) {
          reset();
          const {data} = await messageProvider.getAllMessagesByUser(user?.token, friend?.id.toString());
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
                          <TiArrowBack/>
                        </Button>
                        <Text fontSize='l' color='teal' style={{ marginLeft: '20px' }}>Créer un nouveau groupe</Text>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBlock: '20px'}}>
                        <Button colorScheme='teal' variant='solid' onClick={() => router.push('/chat')}>
                          <TiArrowBack/>
                        </Button>
                        <Text fontSize='l' color='teal' style={{ marginLeft: '20px' }}>Messages de Groupes</Text>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBlock: '20px'}}>
                        <Button colorScheme='teal' variant='solid' onClick={() => router.push('/profile')}>
                          <BsInfoSquare/>
                        </Button>
                        <Text fontSize='l' color='teal' style={{ marginLeft: '20px' }}>{"Informations d'utilisateurs"}</Text>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBlock: '20px'}}>
                        <Button colorScheme='teal' variant='solid' onClick={() => router.push('/login')}>
                          <TbLogout/>
                        </Button>
                        <Text fontSize='l' color='teal' style={{ marginLeft: '20px' }}>Déconnexion</Text>
                      </div>
                      <Text fontSize='2xl' color='black'>{user?.name}</Text>
                      <Text fontSize='2xl' color='black'>{user?.email}</Text>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </div>
              <Text color='white'>Mamaly.io</Text>
            </div>
            <div style={{ marginLeft: 550 }}>
              <Text color='white' width={300}>MESSAGES PRIVEES</Text>
            </div>
            <div style={{ marginLeft: 400 }}>
              <Button colorScheme='teal' variant='solid' onClick={() => router.push('/login')}>
                <TbLogout/>
              </Button>
            </div>
          </div>
          <div className={chat.all}>
            <div className={chat.avatar}>
              <AvatarGroup style={{ flexDirection: 'column', alignItems: 'flex-start', paddingTop: '10px' }}>
                {allUsers.map(friend => (
                    <ChanelAvatar key={friend.id} text={friend.name} onClick={() => showFriend(friend)}/>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBlock: 5 }}>
                  <div style={{ width: '30%', display: 'flex', justifyContent: 'center' }}>
                    <Button colorScheme='teal' variant='solid' onClick={() => showUsers()}>
                      <AiOutlineReload/>
                    </Button>
                  </div>
                </div>
              </AvatarGroup>
            </div>
            <div className={chat.container}>
              <div style={{ width: '100%', height: 70, borderBottomWidth: '1px', borderColor: palette.primaryPurple, display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                <div style={{ width: '85%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                  <Text fontSize='lg' color='white'>{friend?.name}</Text>
                </div>
                <Button colorScheme='teal' variant='solid' onClick={() => getAllMessages()}>
                  <AiOutlineReload/>
                </Button>
              </div>
              <div style={{ width: '100%', height: 590, display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {allMessages?.slice().reverse().map(message => (
                        message.sender.id == user?.id ?
                            <CardMessageSender key={message.id} text={message.content} sender={message.sender.name}/> :
                            <CardMessage key={message.id} text={message.content} sender={message.sender.name}/>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ width: '100%',height: 70, display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                <Input color='teal' type='email' focusBorderColor='teal' style={{ backgroundColor: 'white', marginLeft: 30 }} required {...register("content")}/>
                <Button colorScheme='teal' variant='solid' style={{ width: 70, marginInline: 30 }} onClick={handleSubmit(onSubmit)}>
                  <AiOutlineSend />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </>
  )
};

export default UserID;
