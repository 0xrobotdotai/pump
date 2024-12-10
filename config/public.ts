import RobotTokenABI from './abi/RobotToken.json';
import MingingPool from './abi/MingingPool.json';
import PumpToken from './abi/PumpToken.json';
import RobotPad from './abi/RobotPad.json';
import { defaultChain } from './wagmi';

export const RobotTokenContract = {
  address: "0xe5F8dBf17c9eC8eb327D191dBA74e36970877587",
  abi: RobotTokenABI,
} as const;



const allContracts = {
  4689: {
    'RobotToken': '0xe5F8dBf17c9eC8eb327D191dBA74e36970877587',
    'RobotPad': '0xC480d88a5F0Cd2f06569BC5bEf794845F7033458',
    'MiningPool': '',
  },
  4690: {
    'RobotToken': '0x9f8983750E8fE5f3F3D8a039633Eb2fF20a4f5a1',
    'RobotPad': '0xcfbeCcfaF4e0813b0866838d9F7e348fC09a1e38',
    'MiningPool': '0x0f713f06b29538B71570bD5dA4aF49040ff70689',
  }
}

const allAbi = {
  'RobotToken': RobotTokenABI,
  'MiningPool': MingingPool,
  'PumpToken': PumpToken,
  'RobotPad': RobotPad,
}


export const getContract = (contractName: 'RobotToken' | 'MiningPool' | 'RobotPad') => {
  return {
    address: allContracts[defaultChain.id][contractName] as `0x${string}`,
    abi: allAbi[contractName],
  }
}

export const getContractAddress = (contractName: 'RobotToken' | 'MiningPool' | 'RobotPad') => {
  return allContracts[defaultChain.id][contractName] as `0x${string}`
}

  
export const publicConfig = {
  isProd: process.env.NEXT_PUBLIC_APP_ENV === 'production',
  chainId: 4689,
  ROBOT_PUMP_GRAPH_URL: 'https://graph.mainnet.iotex.io/subgraphs/name/robotpump/main',
  ROBOT_PUMP_GRAPH_URL_Test: 'https://graph.mainnet.iotex.io/subgraphs/name/robotpump/test',
}

export const ROBOT_AI_CREATOR_ADDRESS = "0xa14389E0D231E5B4Ca504DfbADC27EECBeff253B"
