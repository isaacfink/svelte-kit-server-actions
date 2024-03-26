<script lang="ts">
  import { sampleServerAction } from "$lib/test.actions";

  let id: number = 0;
  let name: string = "";

  function handleClick() {
    sampleServerAction({ id, name })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
</script>

<input bind:value={id} type="number" />
<input bind:value={name} type="text" />
<button on:click={handleClick}>Run server action</button>
