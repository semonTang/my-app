<template>
  <div>
    <router-link to="/">main page</router-link>

    <div>
      Status Name:
      <input placeholder="new status name" v-model="statusName" />
    </div>
    <br />
    <div>Could be transferred to:</div>
    <div class="box">
      <div class="item" :class="item.checked ? 'active' : ''" v-for="item in status" :key="item.id" @click="handleToggle(item)">
        {{ item.id === currentId ? 'self' : item.name }}
      </div>
    </div>
    <br />

    <button class="btn" @click="handleClick">create status</button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useStatusStore } from '@/store';

  const { status, increment, updateItem } = useStatusStore();

  const statusName = ref('');
  const currentId = ref('');

  const handleClick = () => {
    if (!statusName.value) {
      alert('please input status name');
      return;
    }
    const item = {
      name: statusName.value,
      id: (status.length + 1).toString(),
    };
    currentId.value = item.id;
    increment(item);
    status.forEach((item) => {
      delete item.checked;
      updateItem(item);
    });
  };

  const handleToggle = (item) => {
    const checkedList: Array<{ id: string; name: string }> = [];
    item.checked = !item.checked;
    if (item.checked) {
      checkedList.push({ id: item.id, name: item.name });
    } else {
      const index = checkedList.findIndex((record) => record.id === item.id);
      checkedList.splice(index, 1);
    }
    updateItem({ id: currentId.value, name: statusName.value, list: checkedList });
  };
</script>

<style scoped>
  .box {
    width: 200px;
    height: 150px;
    border: 1px solid #ccc;
    overflow-y: auto;
  }

  .box .item {
    cursor: pointer;
    color: #000;
  }

  .box .active {
    background-color: #409eff;
    color: #ffffff;
  }
</style>
