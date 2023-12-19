<template>
  <div>
    <router-link to="/">main page</router-link>

    <div>Status Name: {{ currentStatus?.name ?? '' }} <span class="del" @click="handleDelete">delete</span></div>
    <br />
    <div>Could be transferred to:</div>

    <div class="box">
      <div class="item" :class="item.checked ? 'active' : ''" v-for="item in newStatus" :key="item.id" @click="handleToggle(item)">
        {{ item.name }}
      </div>
    </div>
    <br />

    <button class="btn" @click="handleUpdate">update status</button>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useStatusStore } from '@/store';

  const route = useRoute();
  const router = useRouter();
  const { status, updateItem, deleteItem } = useStatusStore();

  const checkedList = ref<{ id: string; name: string }[]>([]);
  const currentStatus = computed(() => status?.find((item) => item.id === route.params.id));

  checkedList.value = currentStatus.value?.list ?? [];

  const newStatus = computed(() => {
    return status.map((item) => ({
      ...item,
      checked: checkedList?.value?.find((record) => record.id === item.id),
    }));
  });

  const handleToggle = (item: { checked: boolean; id: string; name: any; }) => {
    item.checked = !item.checked;
    if (item.checked) {
      checkedList.value.push({ id: item.id, name: item.name });
    } else {
      const index = checkedList.value.findIndex((record) => record.id === item.id);
      checkedList.value.splice(index, 1);
    }
  };

  const handleDelete = () => {
    deleteItem(currentStatus.value);
    router.back();
  };

  const handleUpdate = () => {
    updateItem({ id: currentStatus.value?.id ?? '', name: currentStatus.value?.name ?? '', list: checkedList.value });
  };
</script>

<style scoped>
  .del {
    display: inline-block;
    color: #409eff;
    cursor: pointer;
    text-decoration: underline;
  }

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
