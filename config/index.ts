import { ethers } from "ethers"
import { RPC_URLS } from "~~/connectors"

const polygonProvider = new ethers.JsonRpcProvider(RPC_URLS[137])

const avoProvider = new ethers.JsonRpcProvider(RPC_URLS[634])

const optProvider = new ethers.JsonRpcProvider(RPC_URLS[10])

const ArbProvider = new ethers.JsonRpcProvider(RPC_URLS[42161])

const forwarderABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner_",
                "type": "address"
            },
            {
                "internalType": "uint32",
                "name": "index_",
                "type": "uint32"
            }
        ],
        "name": "computeAvocado",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }]

export const ERC20_ABI = [

    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{ "name": "", "type": "string" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            { "name": "_spender", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            { "name": "_from", "type": "address" },
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "name": "", "type": "string" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            { "name": "_owner", "type": "address" },
            { "name": "_spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    { "payable": true, "stateMutability": "payable", "type": "fallback" },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "name": "owner", "type": "address" },
            { "indexed": true, "name": "spender", "type": "address" },
            { "indexed": false, "name": "value", "type": "uint256" }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "name": "from", "type": "address" },
            { "indexed": true, "name": "to", "type": "address" },
            { "indexed": false, "name": "value", "type": "uint256" }
        ],
        "name": "Transfer",
        "type": "event"
    }
];

const forwarderContractAddress = '0x46978CD477A496028A18c02F07ab7F35EDBa5A54'
const usdtPolygonContractAddress = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
const usdcPolygonContractAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
const usdcArbContractAddress = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
const daiOptContractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'

export const forwarderContract = new ethers.Contract(forwarderContractAddress, forwarderABI, polygonProvider);

export const usdtPolygonContract = new ethers.Contract(usdtPolygonContractAddress, ERC20_ABI, polygonProvider);

export const usdcPolygonContract = new ethers.Contract(usdcPolygonContractAddress, ERC20_ABI, polygonProvider);

export const usdcArbContract = new ethers.Contract(usdcArbContractAddress, ERC20_ABI, ArbProvider);

export const daiOptContract = new ethers.Contract(daiOptContractAddress, ERC20_ABI, optProvider);

type NetworkConfig = {
    chainName: string;
    chainId: string;
    nativeCurrency: { name: string; decimals: number; symbol: string };
    rpcUrls: string[];
};

export const networks: { [key: number]: NetworkConfig } = {
    1: {
        chainName: 'Ethereum Mainnet',
        chainId: '0x1',
        nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
        rpcUrls: [RPC_URLS[1]]
    },
    10: {
        chainName: 'Optimism LlamaNodes',
        chainId: '0xa',
        nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
        rpcUrls: [RPC_URLS[10]]
    },
    137: {
        chainName: 'Polygon Mainnet',
        chainId: '0x89',
        nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
        rpcUrls: [RPC_URLS[137]]
    },
    634: {
        chainName: 'Avocado Mainnet',
        chainId: '0x27A',
        nativeCurrency: { name: 'USDC', decimals: 18, symbol: 'USDC' },
        rpcUrls: [RPC_URLS[634]]
    },
    42161: {
        chainName: 'Arbitrum LlamaNodes',
        chainId: '0xA4B1',
        nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
        rpcUrls: [RPC_URLS[42161]]
    }
}
