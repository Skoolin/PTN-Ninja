<template>
  <div class="game-selector no-wrap">
    <q-select
      ref="select"
      v-if="games.length"
      class="text-subtitle1 no-wrap"
      :value="0"
      :options="showSearch ? filteredGames : games"
      :use-input="showSearch"
      :input-debounce="150"
      @blur="showSearch = false"
      @filter="search"
      @input="select"
      @keydown.esc="$refs.select.blur"
      @keydown.delete="showSearch ? null : close($refs.select.optionIndex)"
      :hide-dropdown-icon="$q.screen.lt.sm"
      behavior="menu"
      popup-content-class="game-selector-options"
      transition-show="none"
      transition-hide="none"
      :virtual-scroll-item-size="84"
      emit-value
      filled
      dense
    >
      <template v-slot:selected>
        <span>{{ showSearch ? "" : name }}</span>
      </template>

      <template v-slot:prepend>
        <q-btn
          :label="games.length"
          @click.stop.prevent
          class="text-subtitle2 q-pa-sm"
          dense
          flat
        >
          <q-menu
            transition-show="none"
            transition-hide="none"
            auto-close
            square
          >
            <q-list>
              <q-item
                clickable
                @click="$router.push({ name: 'close' })"
                :disable="games.length < 2"
              >
                <q-item-section side>
                  <q-icon name="close_multiple" />
                </q-item-section>
                <q-item-section>{{ $t("Close") }}...</q-item-section>
              </q-item>
              <q-item clickable @click="$router.push({ name: 'download' })">
                <q-item-section side>
                  <q-icon name="download" />
                </q-item-section>
                <q-item-section>{{ $t("Download") }}...</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-separator vertical class="q-mr-sm" />

        <q-btn
          v-if="config.isOnline"
          :icon="icon"
          @click.stop.prevent="account"
          dense
          flat
        />
      </template>

      <template v-slot:option="scope">
        <GameSelectorOption
          :option="scope.opt"
          :show-icon="hasOnlineGames"
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
        />
      </template>

      <template v-slot:append>
        <div class="row q-gutter-sm">
          <q-badge
            v-if="unseenCount"
            text-color="ui"
            :label="unseenCount"
            class="q-mr-sm"
          />
          <q-icon
            name="search"
            @click.stop="toggleSearch()"
            class="q-field__focusable-action q-mr-sm"
            :color="showSearch ? 'primary' : ''"
          >
            <hint>{{ $t("Search") }}</hint>
          </q-icon>
          <slot />
        </div>
      </template>
    </q-select>
  </div>
</template>

<script>
import GameSelectorOption from "./GameSelectorOption";

import Fuse from "fuse.js";
const fuseOptions = {
  keys: ["name"],
  threshold: 0.8,
  ignoreLocation: true,
};

export default {
  name: "GameSelector",
  components: { GameSelectorOption },
  data() {
    return {
      showSearch: false,
      filteredGames: null,
      query: "",
      index: null,
    };
  },
  computed: {
    config() {
      return this.$store.state.game.config;
    },
    games() {
      return this.$store.state.game.list.map((game, index) => ({
        label: game.name,
        value: index,
        config: game.config,
        state: game.state,
      }));
    },
    gameList() {
      return this.$store.state.game.list.map((g) => g.name);
    },
    hasOnlineGames() {
      return this.games.some((game) => game.config.id);
    },
    icon() {
      if (this.$game.config.isOnline) {
        return this.$store.getters["ui/playerIcon"](
          this.$game.config.player,
          this.$game.config.isPrivate
        );
      } else {
        return "file";
      }
    },
    name() {
      const name = this.games[0].label;
      if (!this.config.isOnline || this.$q.screen.gt.sm) {
        return name;
      } else {
        let player = this.config.player;
        let otherPlayer = player ? (player === 1 ? 2 : 1) : 0;
        if (!otherPlayer) {
          return name;
        } else {
          otherPlayer = this.$game.tag("player" + otherPlayer);
          if (otherPlayer) {
            return name.replace(
              /[^"]+ vs [^"]+( \dx\d)/,
              "vs " + otherPlayer + "$1"
            );
          } else {
            return name;
          }
        }
      }
    },
    unseenCount() {
      return this.games.filter((game) => game.config.unseen).length;
    },
  },
  methods: {
    account() {
      const user = this.$store.state.online.user;
      const player = this.games[0].config.player;
      if (!player) {
        this.$router.push({ name: "join" });
      } else if (user && !user.isAnonymous) {
        this.$router.push({ name: "account" });
      } else {
        this.$router.push({ name: "login" });
      }
    },
    select(index) {
      this.showSearch = false;
      this.$store.dispatch("game/SELECT_GAME", { index });
      this.$emit("input", this.$store.state.game.list[0]);
    },
    toggleSearch(focusInput = false) {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        this.$refs.select.inputValue = this.query;
        if (focusInput) {
          this.$nextTick(() => {
            this.$refs.select.focus();
            this.$refs.select.showPopup();
          });
        }
      }
    },
    search(query, update) {
      this.query = query;
      update(
        () => this.updateFiltered(),
        (ref) => {
          if (query.trim() !== "" && ref.options.length > 0) {
            ref.setOptionIndex(-1);
            ref.moveOptionSelection(1, true);
          }
        }
      );
    },
    updateIndex() {
      if (!this.index) {
        this.index = new Fuse(this.gameList, fuseOptions);
      } else {
        this.index.setCollection(this.gameList);
      }
    },
    updateFiltered() {
      this.filteredGames = this.index
        .search(this.query)
        .map((result) => this.games[result.refIndex]);
    },
  },
  watch: {
    gameList() {
      this.updateIndex();
      this.updateFiltered();
    },
  },
  mounted() {
    this.updateIndex();
  },
};
</script>

<style lang="scss">
.game-selector {
  max-width: 30em;
  margin: 0 auto;
  .q-field--filled .q-field__control {
    padding-left: 0;
    @media (max-width: $breakpoint-xs-max) {
      padding-right: 0;
    }
  }

  .q-field__native {
    span {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      @media (max-width: $breakpoint-xs-max) {
        font-size: 0.85em;
      }
    }

    .no-outline {
      position: absolute;
    }
  }
  .q-badge {
    align-self: center;
    padding: 5px;
    font-weight: bold;
  }
}

.game-selector-options {
  .q-badge {
    padding: 4px;
  }
}
</style>
