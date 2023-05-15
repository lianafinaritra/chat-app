import Reactotron from 'reactotron-react-js';

const reactotron = Reactotron.configure()
  .connect();

reactotron.clear();
    
export default reactotron;