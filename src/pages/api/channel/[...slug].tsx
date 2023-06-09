import { NextApiRequest, NextApiResponse } from 'next';
import Create from '../../channel/create';
const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const { slug } = req.query;

    if (Array.isArray(slug)) {
        if (slug[0] === 'create') {
            // Route `/channel/create`
            // Renvoyer le composant CreateChannelPage
            res.send(<Create />);
        } else if (slug[0] === 'message') {
            // Route `/channel/message`
            // Renvoyer le composant ChannelMessagePage
            // Exemple : res.send(<ChannelMessagePage />);
        } else {
            res.status(404).end();
        }
    }
};

export default handler;
