<template>
  <span class="font-medium">EOA ADDRESS :</span>
  <span :style="{
    gridColumn: '2/4',
  }">{{
  account === null
  ? "Error"
  : account
    ? `${account.substring(0, 10)} . . . ${account.substring(
      account.length - 8
    )}`
    : ""
}}</span>
  <span class="font-medium">SAFE ADDRESS :</span>
  <span :style="{
          gridColumn: '2/4',
        }">{{
        safeAddressValue === null
        ? "Error"
        : safeAddressValue
          ? `${safeAddressValue.substring(0, 10)} . . . ${safeAddressValue.substring(
            safeAddressValue.length - 8
          )}`
          : ""
      }}</span>
</template>

<script setup lang="ts">
import { store } from '~/stores/store'
const { account } = useWeb3();

const safeAddressValue = ref<string | null>(store.safeAddress); // Store the value in a separate ref
watch(() => store.safeAddress, () => {
  safeAddressValue.value = store.safeAddress;
});

</script>
