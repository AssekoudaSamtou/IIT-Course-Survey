<template>
    <v-app>
        <v-row class="mb-6" no-gutters>
          <v-col>
            <v-card class="pa-2" tile>
              <vc-donut :sections="sections">Basic donut</vc-donut>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="pa-2" tile>
              <vc-donut
                  :sections="[{ value: 35 }, { value: 15 }, { value: 15 }, { value: 35 }]"
                  :thickness="100"
              />
            </v-card>
          </v-col>
          <v-col>
            <v-card class="pa-2" tile>
              <vc-donut
                background="white" foreground="grey"
                :size="200" unit="px" :thickness="30"
                has-legend legend-placement="top"
                :sections="sections" :total="100"
                :start-angle="0" :auto-adjust-text-size="true"
                @section-click="handleSectionClick">
                <h1>75%</h1>
              </vc-donut>
            </v-card>
          </v-col>
        </v-row>
    </v-app>
</template>

<script>
    export default {
        name: "Index",
        props: {
        },
        data: function() {
            return {
                sections: [
                    { label: 'Red section', value: 25, color: 'red' },
                    { label: 'Green section', value: 25, color: 'green' },
                    { label: 'Blue section', value: 25, color: 'blue' }
                ]
            };
        },

        methods: {
          handleSectionClick: function(section, event) {
            console.log(`${section.label} clicked.`, event);
          }
        },

      beforeCreate() {
            if (!this.$cookies.isKey("user")) {
                this.$router.push({name: "login"});
            }else {
                this.$store.commit('setUserInfo', this.$cookies.get("user"));
            }
        }
    }
</script>

<style scoped>

</style>
