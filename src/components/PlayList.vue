<template>
  <div class="flex-table">
    <div class="flex-header">
      <div class="flex-row">
        <div class="flex-cell" v-for="column in columns" @click="sortBy(column)">
          <span>{{column.display}}</span><icon class="sort-direction" name="caret-down"></icon>
        </div>
        <div class="flex-cell scrollbar-placeholder"></div>
      </div>
    </div>
    <div class="flex-body">
      <div class="flex-row" v-for="song in sortedPlaylist">
        <div class="flex-cell" v-for="column in columns">
          {{song[column.value]}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'
  import 'vue-awesome/icons/caret-down'
  import 'vue-awesome/icons/caret-up'
  import Icon from 'vue-awesome/components/Icon.vue'

  export default {
    name: 'playList',
    components: {
      Icon
    },
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
        }],
        sort: {
          arts: 'asc',
          name: 'asc'
        }
      }
    },
    created: function () {
      axios.get('/api/playlist')
        .then((response) => {
          this.playlist = response.data
        })
        .catch((error) => {
          this.error = error
        })
    },
    computed: {
      sortedPlaylist () {
        return _.orderBy(this.playlist, ['arts', 'name'], [this.sort.arts, this.sort.name])
      }
    },
    methods: {
      sortBy (column) {
        this.sort = Object.assign({}, this.sort, {
          [column.value]: this.sort[column.value] === 'asc' ? 'desc' : 'asc'
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @borderColor: gray;
  @headerHoverColor: #ddd;
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
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;

          &.scrollbar-placeholder {
            width: 14px;
            flex: 0 0 auto;
            background-color: @borderColor;
          }

          &:hover {
            background-color: @headerHoverColor;
          }

          .sort-direction {

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
