<template>
  <span class="font-medium">Balance</span>
  <span role="img" aria-label="gold"> 💰 </span>
  <span>{{
    balance === null
    ? "Error"
    : balance
      ? `Ξ${library.utils.fromWei(balance)}`
      : ""
  }}</span>
</template>

<script setup lang="ts">
import { usdcPolygonContract } from '~~/config';

const { account, library, chainId } = useWeb3();


const balance = ref<string | null>();

watch([account, library, chainId], async () => {
  if (!!library.value && !!account.value) {
    const usdc = await usdcPolygonContract.balanceOf(account.value);
    console.log(usdc.toString());
    library.value.eth
      .getBalance(account.value)
      .then((value: any) => {
        balance.value = value;
      })
      .catch(() => { });
  }
});
</script>
