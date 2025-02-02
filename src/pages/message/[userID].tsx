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
  useDisclosure, useToast
} from "@chakra-ui/react";
import {MouseEventHandler, useEffect, useRef} from "react";
import {Avatar, AvatarGroup} from "@chakra-ui/avatar";
import {useForm} from "react-hook-form";
import {messageProvider} from "@/services/providers/message-provider";
import {authProvider} from "@/services/providers/auth-provider";
import Head from "next/head";
import chat from "@/styles/Chat.module.css";
import {inter} from "@/pages/_app";
import {AiOutlineMenu, AiOutlineReload, AiOutlineSend } from "react-icons/ai";
import {TiArrowBack} from "react-icons/ti";
import {BsInfoSquare} from "react-icons/bs";
import {TbLogout} from "react-icons/tb";
import {palette} from "@/theme/palette";
import {useRouter} from "next/router";
import {logout} from "@/pages/utils/logout";
import {CardMessage, CardMessageSender} from "@/pages/components/card-message";
import {BiAddToQueue} from "react-icons/bi";
import {HiOutlineUserGroup} from "react-icons/hi";
interface ChanelAvatarProps {
  text: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

const UserID = () => {
  const toast = useToast();
  const router = useRouter();
  const { userID } = router.query;
  const id = Array.isArray(userID) ? userID[0] : userID;
  const { user, setUsers, allUsers } = useAuthStore();
  const { friend, setFriend } = useChannelStore();
  const { allMessages ,setMessages } = useMessageStore();

  const { isOpen: openMember, onOpen: onOpenMember, onClose: onCloseMember } = useDisclosure();
  const { isOpen: openDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure()


  const { push}= useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const getAllMessages = async () => {
      if (token) {
        if (user && user.token && id) {
          const {data, check} = await messageProvider.getAllMessagesByUser(user.token, id.toString());
          if (check) {
            setMessages(data);
            const {data: users} = await authProvider.getAllUsers(user.token);
            setUsers(users);
          } else {
          }
        }
      } else {
        push('/login');
      }
    };
    getAllMessages();
    const interval = setInterval(getAllMessages, 3000);
    return () => clearInterval(interval);
  }, [push]);

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
      if (user && user.token && friend) {
        console.log(infos)
        const {check} = await messageProvider.createMessage(user.token, {content: infos.message, channelId: null, recipientId: friend.id.toString()});
        if (check) {
          reset();
          toast({
            title: 'Ajouté avec success',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          const {data} = await messageProvider.getAllMessagesByUser(user?.token, friend?.id.toString());
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
          <title>Messages</title>
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
                        <Button colorScheme='teal' variant='solid' onClick={() => router.push('/channel/1')}>
                          <HiOutlineUserGroup/>
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
              <Text color='white' width={300}>MESSAGES PRIVEES</Text>
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
                {allUsers.map(friendItem => (
                    <ChanelAvatar key={friendItem.id} text={friendItem.name} onClick={async() => {
                      setFriend(friendItem);
                      await push('/message/'+friendItem.id);
                    }}/>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBlock: 5 }}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Text fontSize='lg' color='teal'>Amis</Text>
                  </div>
                </div>
              </AvatarGroup>
            </div>
            <div className={chat.container}>
              <div style={{ width: '100%', height: 70, borderBottomWidth: '1px', borderColor: palette.primaryPurple, display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                  <Text fontSize='2xl' color='white'>{friend?.name}</Text>
                </div>
              </div>
              <div style={{ width: '100%', height: 590, display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {allMessages?.slice().reverse().map(message => (
                        message.sender.id == user?.id ?
                            <CardMessageSender key={message.id} message={message}/> :
                            <CardMessage key={message.id} message={message}/>
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

export default UserID;
