<template>
  <div>{{ survey }}</div>
</template>

<script setup lang="ts">
import Survey from "../../classes/Survey";
import type { ISurvey } from "../../contracts/i-survey";
const survey: ISurvey = new Survey({
  id: "123ert",
  Name: "KHLD",
  Description: "",
  Users: [],
  Questions: [],
});
</script>

<style scoped></style>
