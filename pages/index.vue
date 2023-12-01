<template>
  <div class="bg-gray-500 min-h-screen md:flex items-center justify-center text-white">
    <div
      class="relative md:max-w-lg min-h-screen md:min-h-0 w-full md:mx-auto bg-gray-800 shadow-lg md:rounded-lg px-8 py-6">
      <div>
        <h1 class="text-right">
          {{ active ? "🟢" : error ? "🔴" : "🟠" }}
        </h1>

        <h3 :style="{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr min-content 1fr',
          maxWidth: '24rem',
          lineHeight: '2rem',
          margin: 'auto',
        }">
          <Address />
        </h3>
      </div>

      <hr :style="{ margin: '2rem' }" />
      <div :style="{
        display: 'grid',
        gridGap: '1rem',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '23rem',
        margin: 'auto',
      }">
        <EOAWallet />
        <SafeWallet />
      </div>
      <div class="text-center mt-5 ">
        <button v-if="active" @click="onToggle"
          class="bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600">
          Transfer
        </button>
      </div>
      <hr :style="{ margin: '2rem' }" />

      <div :style="{
        display: 'grid',
        gridGap: '1rem',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '20rem',
        margin: 'auto',
      }">
        <button v-for="(newConnector, name) in connectorsByName"
          class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :key="name" @click="setActivatingConnector(newConnector)">
          <span class="mr-2" v-if="newConnector === connector" role="img" aria-label="check">
            ✅
          </span>
          <svg v-else-if="activatingConnector === newConnector" class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-indigo"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>

          {{ name }}
        </button>
        <button v-if="active"
          class="inline-flex justify-center items-center  text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-red-800 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          @click="deactivate">
          Deactivate
        </button>
      </div>

      <div class="flex flex-col items-center mt-8 text-center">
        <h4 v-if="!!error" :style="{ marginTop: '1rem', marginBottom: '0' }">
          {{ getErrorMessage(error) }}
        </h4>
      </div>
    </div>
  </div>
  <transition name="fade">
    <div v-if="isModalVisible">
      <div @click="onToggle" class="absolute bg-black opacity-70 inset-0 z-0"></div>
      <div class="w-full max-w-lg p-3 relative mx-auto my-auto rounded-xl shadow-lg bg-white my-modal">
        <div>
          <div class="text-center p-3 flex-auto justify-center leading-6">
            <h2 class="text-2xl font-bold py-4">Token Transfer</h2>
            <p class="text-md text-gray-500 px-8">
              Select the token you want to transfer
            </p>
            <select v-model="token" id="token" name="token"
              class="relative m-auto my-3 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
              <option value="usdc-137">USDC in Polygon</option>
              <option value="usdt-137">USDT in Polygon</option>
              <option value="usdc-42161">USDC in Arb</option>
              <option value="dai-10">DAI in Opt</option>
            </select>
            <p class="text-md text-gray-500 px-8">
              Enter the token amount to transfer
            </p>
            <input type="amount" name="amount" id="amount" v-model="amount"
              class="block rounded-md m-auto border-0 my-3 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="amount">
          </div>
          <p class="text-md text-gray-500 px-8 error-message" v-if="errorMessage">
              {{errorMessage}}
            </p>
          <div class="p-3 mt-2 text-center space-x-4 md:block">
            <button @click="onTransfer"
              class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-md hover:shadow-lg hover:bg-gray-100">
              Transfer
            </button>
            <button @click="onToggle"
              class="mb-2 md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { UnsupportedChainIdError } from "@instadapp/vue-web3";
import { injected } from "~/connectors";
import { ERC20_ABI, forwarderContract, networks } from "~/config";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { store } from '~/stores/store'
import { ethers } from "ethers";
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';

const { active, activate, deactivate, connector, error, account, chainId: currentChainId, provider } = useWeb3();

enum ConnectorNames {
  Injected = "Injected",
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
};

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

useEagerConnect();

const activatingConnector = ref();
const isOpen = ref();
const isModalVisible = ref();
const token = ref();
const amount = ref();
const errorMessage = ref();

const onToggle = () => {
  isOpen.value = !isOpen.value;
}

const onTransfer = async () => {
  // Request access to the user's MetaMask account
  await provider.value.request({ method: 'eth_requestAccounts' });

  // Create a provider using MetaMask's provider
  const metaMaskProvider = new Web3Provider(provider.value)
  const signer = metaMaskProvider.getSigner();

  let contractAddress: string = "";
  if (token.value === 'usdc-137') {
    contractAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
  } else if (token.value === 'usdt-137') {
    contractAddress = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f';
  } else if (token.value === 'usdc-42161') {
    contractAddress = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
  } else if (token.value === 'dai-10') {
    contractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1';
  }

  const contract = new Contract(contractAddress, ERC20_ABI, signer);

  const tokenAmount = ethers.parseUnits(amount.value, token.value === 'dai-10' ? 18 : 6);

  const estimateGas = await contract.estimateGas.transfer(store.safeAddress, tokenAmount);

  let gasLimit = estimateGas.toNumber() + 100000;
  const tx = await contract.transfer(store.safeAddress, tokenAmount, { gasLimit: gasLimit });
  await tx.wait()
  onToggle()
}

const switchNetwork = async (chainId: any) => {
  if (currentChainId.value !== chainId) {
    const hexChainId = "0x" + parseInt(ethers.toBeHex(chainId), 16).toString(16);
    try {
      await provider.value.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        await provider.value.request({
          method: 'wallet_addEthereumChain',
          params: [networks[chainId]]
        });
      }
    }
  }
}

const setActivatingConnector = async (newConnector: any) => {
  activatingConnector.value = newConnector;
  await activate(newConnector);
  activatingConnector.value = undefined;
};

const fetchSafeAddress = async () => {
  if (!!account.value) {
    store.safeAddress = await forwarderContract.computeAvocado(account.value, 0);
  } else {
    store.safeAddress = ""
  }
};

watch([amount], () => {
  if (!!token.value) {
    let oldAmount = 0;
    if (token.value === 'usdc-137') {
      oldAmount = store.usdcPolygon;
    } else if (token.value === 'usdt-137') {
      oldAmount = store.usdtPolygon;
    } else if (token.value === 'usdc-42161') {
      oldAmount = store.usdcArb;
    } else if (token.value === 'dai-10') {
      oldAmount = store.daiOpt;
    }
    if(Number(amount.value) > oldAmount) {
      errorMessage.value = 'Insufficient balance'
    } else {
      errorMessage.value = null;
    }
  }
})

watch([token], () => {
  switchNetwork(token.value.split("-")[1])
})


watch([account], fetchSafeAddress);

watch([isOpen], () => {
  isModalVisible.value = isOpen.value
});

useIntervalFn(fetchSafeAddress, 1000);

</script>


<style>
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 500ms ease-out;
}

.my-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.error-message{
  color: brown;
  text-align: center;
}
</style>