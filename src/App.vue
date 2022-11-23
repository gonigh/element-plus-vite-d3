<template>
  <el-config-provider namespace="ep">
    <BaseHeader style="height: 8%;"/>
    <div style="display: flex;width:100%;height: 90%;">
      <BaseSide />
      <div style="flex:1">
        <KeepAlive>
          <RouterView></RouterView>
        </KeepAlive>

      </div>
    </div>
  </el-config-provider>
</template>

<style>

html body{
  height: 100%;
  width: 100%;
}
#app {
  text-align: center;
  height: 100%;
  width: 100%;
  color: var(--ep-text-color-primary);
}

.element-plus-logo {
  width: 50%;
}
</style>
