import {Card, CardBody, Text} from "@chakra-ui/react";
import {Message} from "@/services/types/message";

interface CardMessageProps {
    message: Message;
}

export const CardMessageSender= ({ message }: CardMessageProps) => {
    const createdAt = new Date(message.createdAt);
    const heure = ("0" + createdAt.getHours()).slice(-2); // Obtient l'heure avec un zéro devant si nécessaire
    const minutes = ("0" + createdAt.getMinutes()).slice(-2);
    return(
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Text color='white' fontSize='sm' style={{ marginLeft: 1100, marginTop: 10 }}>{message.sender.name}</Text>
                <Text color='white' fontSize='sm' style={{ marginLeft: 10, marginTop: 10 }}>{heure}:{minutes}</Text>
            </div>
            <Card style={{ borderRadius: 10, borderWidth: 2, borderColor: 'red', backgroundColor: 'transparent', width: '40%', height: 50, justifyContent: 'center', marginLeft: 750, marginBottom: 10}}>
                <CardBody style={{ backgroundColor: 'transparent' }}>
                    <Text color='white'>{message.content}</Text>
                </CardBody>
            </Card>
        </>
    )
}

export const CardMessage= ({ message }: CardMessageProps) => {
    const createdAt = new Date(message.createdAt);
    const heure = ("0" + createdAt.getHours()).slice(-2); // Obtient l'heure avec un zéro devant si nécessaire
    const minutes = ("0" + createdAt.getMinutes()).slice(-2);
    return(
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Text color='white' fontSize='sm' style={{ marginLeft: 50, marginTop: 10 }}>{message.sender.name}</Text>
                <Text color='white' fontSize='sm' style={{ marginLeft: 10, marginTop: 10 }}>{heure}:{minutes}</Text>
            </div>
            <Card style={{ borderRadius: 10, borderWidth: 2, borderColor: 'red', backgroundColor: 'transparent', width: '40%', height: 50, justifyContent: 'center', marginLeft: 30, marginBottom: 10}}>
                <CardBody style={{ backgroundColor: 'transparent' }}>
                    <Text color='white'>{message.content}</Text>
                </CardBody>
            </Card>
        </>
    )
}