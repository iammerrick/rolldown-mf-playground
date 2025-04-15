<script setup lang="ts">
import { rolldown, __fs, __volume } from '@rolldown/browser'
import ansis from 'ansis'
import { ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const code = useLocalStorage<string>('code', '')
const output = ref()
const timeCost = ref(0)
const compiling = ref(false)

async function compile() {
  if (compiling.value) return
  compiling.value = true

  __fs.rmSync('/app', { recursive: true, force: true })
  const mainCode = code.value
  __volume.fromJSON({ 'main.ts': mainCode }, '/app')

  const t = performance.now()
  try {
    const build = await rolldown({
      input: ['/app/main.ts'],
      cwd: '/app',
      plugins: [
        {
          name: 'vfs',
          resolveId: (id) => id,
          load(id) {
            if (__fs.existsSync(id)) {
              return __fs.readFileSync(id, 'utf8')
            }
          },
        },
      ],
    })
    const { output: chunks } = await build.generate({
      dir: 'dist',
    })

    output.value = chunks
      .map(
        (chunk) =>
          `//${chunk.fileName}\n${'code' in chunk ? chunk.code : chunk.source}`,
      )
      .join('\n')
  } catch (err: any) {
    output.value = ansis.strip(err.toString())
    console.error(err)
    return
  } finally {
    timeCost.value = +(performance.now() - t).toFixed(2)
    compiling.value = false
  }

  if (code.value !== mainCode) {
    compile()
  }
}

watch(code, compile, { immediate: true })
</script>

<template>
  <h1>Rolldown on Browser</h1>
  <textarea
    v-model="code"
    placeholder="Enter your code here..."
    style="width: 500px; height: 200px"
  ></textarea>
  <div>{{ timeCost }}ms</div>
  <pre>{{ output }}</pre>
</template>
