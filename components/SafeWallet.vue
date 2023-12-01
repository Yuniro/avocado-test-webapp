<template>
  <div>
    <p class="font-medium text-center">Safe Wallet</p>

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
import { store } from '~/stores/store'
import { daiOptContract, usdcArbContract, usdcPolygonContract, usdtPolygonContract } from '~~/config';

const { active } = useWeb3();
const usdcPolygonBalance = ref<number | null>();
const usdtPolygonBalance = ref<number | null>();
const usdcArbBalance = ref<number | null>();
const daiOptBalance = ref<number | null>();

const fetchBalances = async () => {
  if (!!store.safeAddress && active.value) {
    const usdcPolygonAmount = await usdcPolygonContract.balanceOf(store.safeAddress);
    usdcPolygonBalance.value = Number(ethers.formatUnits(usdcPolygonAmount, 6).toString())
    const usdtPolygonAmount = await usdtPolygonContract.balanceOf(store.safeAddress);
    usdtPolygonBalance.value = Number(ethers.formatUnits(usdtPolygonAmount, 6).toString())
    const usdcArbAmount = await usdcArbContract.balanceOf(store.safeAddress);
    usdcArbBalance.value = Number(ethers.formatUnits(usdcArbAmount, 6).toString())
    const daiOptAmount = await daiOptContract.balanceOf(store.safeAddress);
    daiOptBalance.value = Number(ethers.formatUnits(daiOptAmount, 6).toString())
  } else {
    usdcPolygonBalance.value = 0
    usdtPolygonBalance.value = 0
    usdcArbBalance.value = 0
    daiOptBalance.value = 0
  }
};

watch(() => store.safeAddress, fetchBalances);

useIntervalFn(fetchBalances, 10000);
</script>
