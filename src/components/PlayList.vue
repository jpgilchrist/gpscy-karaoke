<template>
  <div class="flex-table">
    <div class="flex-header">
      <div class="flex-row">
        <div class="flex-cell" v-for="column in columns">
          {{column.display}}
        </div>
        <div class="flex-cell scrollbar-placeholder"></div>
      </div>
    </div>
    <div class="flex-body">
      <div class="flex-row" v-for="song in playlist">
        <div class="flex-cell" v-for="column in columns">
          {{song[column.value]}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'playList',
    data () {
      return {
        playlist: null,
        error: null,
        columns: [{
          value: 'arts',
          display: 'Artist'
        }, {
          value: 'name',
          display: 'Name'
        }]
      }
    },
    created: function () {
      console.log('PlayList created')
      axios.get('/api/playlist')
        .then((response) => {
          this.playlist = response.data
        })
        .catch((error) => {
          this.error = error
        })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @borderColor: gray;
  .flex-table {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 10px;
    border: 2px solid @borderColor;

    .flex-header {
      .flex-row {
        border-bottom: 2px solid @borderColor;
        .flex-cell {
          font-weight: bold;
          &.scrollbar-placeholder {
            width: 14px;
            flex: 0 0 auto;
            background-color: @borderColor;
          }
        }
      }
    }

    .flex-body {
      flex: 1;
      overflow: auto;
    }

    .flex-row {
      display: flex;
      flex-direction: row;
      border-bottom: 1px solid @borderColor;
      .flex-cell {
        flex: 1;
        border-left: 1px solid @borderColor;
        padding: 5px;
        &:first-of-type {
          border-left: none;
        }
        &.scrollbar-placeholder {
          padding: 0;
        }
      }
    }
  }
</style>
