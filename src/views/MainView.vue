<template>
  <main>
    <div>
      Current Status is: {{ statusOptions.currentName ?? '' }}
      <button class="btn" @click="handleCreate">create status</button>
    </div>
    <br />
    <div>
      Update Status:
      <select v-model="statusOptions.update" class="select-box" @change="handleUpdate">
        <option v-for="item in status" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
    </div>
    <br />
    <div>
      Could be transferred to
      <select v-model="statusOptions.transferId" class="select-box" @change="handleChangeTransfer">
        <option v-for="item in status" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>

      <div v-if="messageOptions.canTransferMsg">{{ messageOptions.canTransferMsg }}</div>
    </div>
    <br />
    <div>
      How could be transferred to
      <select v-model="statusOptions.canTransfer" class="select-box" @change="handleChange">
        <option v-for="item in status" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
      <div v-if="messageOptions.routeMsg">{{ messageOptions.routeMsg }}</div>
    </div>
    <br />
    <div>
      Transferred to
      <select v-model="statusOptions.selected" class="select-box" @change="handleSelect">
        <option v-for="item in status" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
      <div v-if="messageOptions.transferredMsg">{{ messageOptions.transferredMsg }}</div>
    </div>
  </main>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStatusStore } from '@/store';

  const router = useRouter();
  const { status } = useStatusStore();

  const statusOptions = reactive({
    currentName: '',
    currentId: '',
    update: '',
    transferId: '',
    transferName: '',
    canTransfer: '',
    selected: '',
  });

  const messageOptions = reactive({
    canTransferMsg: '',
    routeMsg: '',
    transferredMsg: '',
  });

  const handleCreate = () => {
    router.push('/create');
  };

  const handleUpdate = (e: any) => {
    router.push(`/update/${e.target.value}`);
  };

  function findShortestPath(startId: string, targetId: string) {
    const idToNameMap: { [key: string]: string } = {};
    for (const item of status) {
      idToNameMap[item.id] = item.name;
    }

    const graph: { [key: string]: string[] } = {};
    for (const item of status) {
      graph[item.id] = item.list?.map((obj) => obj.id);
    }

    const visited = new Set();
    const path = [startId];
    let shortestPath: string[] | null = null;

    function dfs(currentId: string) {
      if (currentId === targetId) {
        if (shortestPath === null || path.length < shortestPath.length) {
          shortestPath = [...path];
        }
        return;
      }

      visited.add(currentId);

      for (const neighborId of graph[currentId] || []) {
        if (!visited.has(neighborId)) {
          path.push(neighborId);
          dfs(neighborId);
          path.pop();
        }
      }

      visited.delete(currentId);
    }

    dfs(startId);

    const list = status.find((item) => item.id === startId)?.list;
    const idx = list?.findIndex((item) => item.id === startId) ?? -1;
    if (startId === targetId && idx === -1 && shortestPath && (shortestPath as string[]).length === 1) return null;

    return shortestPath ? (shortestPath as string[]).map((id) => idToNameMap[id]) : null;
  }

  const handleChangeTransfer = (e: any) => {
    const selectedStatus = e?.target?.value;
    const targetName = status.find((item) => item.id === selectedStatus)?.name;

    const shortestPath = findShortestPath(statusOptions.currentId, selectedStatus);

    const msg = `be transferred to ${targetName} from ${statusOptions.currentName}`;

    if (shortestPath) {
      messageOptions.canTransferMsg = `Yes, can ${msg}`;
    } else {
      messageOptions.canTransferMsg = `No, can not ${msg}`;
    }
  };

  const handleChange = (e: any) => {
    const selectedStatus = e?.target?.value ?? e;
    const targetName = status.find((item) => item.id === selectedStatus)?.name;

    const shortestPath = findShortestPath(statusOptions.currentId, selectedStatus);

    if (shortestPath) {
      messageOptions.routeMsg = shortestPath.join(' => ');
    } else {
      messageOptions.routeMsg = `Can not be transferred to ${targetName}`;
    }
  };

  const handleSelect = (e: any) => {
    const list = status.find((item) => item.id === statusOptions.currentId)?.list;
    const item = status.find((item) => item.id === e.target.value);
    if (!statusOptions.currentName || list?.find((item) => item.id === e.target.value)) {
      statusOptions.currentName = item?.name ?? '';
      statusOptions.currentId = item?.id ?? '';
      messageOptions.transferredMsg = '';
      if (statusOptions.canTransfer) handleChange(statusOptions.canTransfer);
    } else {
      statusOptions.selected = statusOptions.currentId;
      messageOptions.transferredMsg = `Can not be transferred to ${item?.name ?? ''}`;
    }
  };
</script>

<style scoped>
  .select-box {
    width: 120px;
  }
</style>
