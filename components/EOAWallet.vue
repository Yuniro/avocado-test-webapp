<template>
  <div>
    <p class="font-medium  text-center">EOS Wallet</p>
    <p>
      <span>{{ usdcPolygonBalance === null ? "Error" : usdcPolygonBalance || "0" }}</span>
      <span role="img" aria-label="numbers"> USDC in Polygon </span>
    </p>

    <p>
      <span>{{ usdtPolygonBalance === null ? "Error" : usdtPolygonBalance || "0" }}</span>
      <span role="img" aria-label="numbers"> USDT in Polygon </span>
    </p>

    <p>
      <span>{{ usdcArbBalance === null ? "Error" : usdcArbBalance || "0" }}</span>
      <span role="img" aria-label="numbers"> USDC in Arb </span>
    </p>

    <p>
      <span>{{ daiOptBalance === null ? "Error" : daiOptBalance || "0" }}</span>
      <span role="img" aria-label="numbers"> DAI in Opt </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ethers } from 'ethers';
import { daiOptContract, usdcArbContract, usdcPolygonContract, usdtPolygonContract } from '~~/config';
import { store } from '~~/stores/store';

const { account, active } = useWeb3();
const usdcPolygonBalance = ref<number | null>();
const usdtPolygonBalance = ref<number | null>();
const usdcArbBalance = ref<number | null>();
const daiOptBalance = ref<number | null>();

const fetchBalances = async () => {
  if (!!account.value && active.value) {
    const usdcPolygonAmount = await usdcPolygonContract.balanceOf(account.value);
    usdcPolygonBalance.value = Number(ethers.formatUnits(usdcPolygonAmount, 6).toString())
    store.usdcPolygon = usdcPolygonBalance.value

    const usdtPolygonAmount = await usdtPolygonContract.balanceOf(account.value);
    usdtPolygonBalance.value = Number(ethers.formatUnits(usdtPolygonAmount, 6).toString())
    store.usdtPolygon = usdtPolygonBalance.value

    const usdcArbAmount = await usdcArbContract.balanceOf(account.value);
    usdcArbBalance.value = Number(ethers.formatUnits(usdcArbAmount, 6).toString())
    store.usdcArb = usdcArbBalance.value

    const daiOptAmount = await daiOptContract.balanceOf(account.value);
    daiOptBalance.value = Number(ethers.formatUnits(daiOptAmount, 18).toString())
    store.daiOpt = daiOptBalance.value

  } else {
    usdcPolygonBalance.value = 0
    usdtPolygonBalance.value = 0
    usdcArbBalance.value = 0
    daiOptBalance.value = 0
  }
};

watch([account], fetchBalances);

useIntervalFn(fetchBalances, 10000);
</script>
