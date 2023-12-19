import { ref } from 'vue';
import { defineStore } from 'pinia';

export type StatusType = {
  id: string;
  name: string;
  list: Array<{ id: string; name: string }>;
};

const status = [
  {
    id: '1',
    list: [
      {
        id: '1',
        name: 'A',
      },
      {
        id: '2',
        name: 'B',
      },
    ],
  },
  {
    id: '2',
    list: [
      {
        id: '1',
        name: 'A',
      },
      {
        id: '2',
        name: 'B',
      },
    ],
  },
];

export const useStatusStore = defineStore('status', () => {
  const status = ref<Array<StatusType>>([]);

  const increment = (val: StatusType) => {
    status.value.unshift(val);
  };

  const updateItem = (val: StatusType) => {
    const index = status.value.findIndex((item) => item.id === val.id);
    index > -1 && (status.value[index].list = val.list);
  };

  const deleteItem = (val: StatusType) => {
    const index = status.value.findIndex((item) => item.id === val.id);
    index !== -1 && status.value.splice(index, 1);
  };

  return { status, increment, updateItem, deleteItem };
});
