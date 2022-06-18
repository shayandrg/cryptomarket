<template>
    <div>
        <v-switch :value="$vuetify.theme.dark" @click="$vuetify.theme.dark = !$vuetify.theme.dark" />
        <v-data-table :headers="headers" :items="data" :loading="loading" item-key="name" class="cryptomarket elevation-1">
            <template v-slot:item.current_price="{ item }">
                {{ item.current_price }}
            </template>
            <template v-slot:item.name="{ item }">
                <div class="h-flex h-center max-w-fit">
                    <img :src="item.image" width="24" max-width="24" height="24" />
                    <div class="mr-5">
                        <div>
                            {{ faNames[item.symbol] || item.name }}
                        </div>
                        <div class="grey--text">
                            {{ item.symbol }}
                        </div>
                    </div>
                </div>
            </template>
        </v-data-table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            data: [],
            headers: [
                { text: '#', value: 'market_cap_rank', width: 20 },
                { text: 'ارز دیجیتال', value: 'name' },
                { text: 'قیمت', value: 'current_price' },
            ],
            interval: null,
            loading: false,
            faNames: {
                ada: "کاردانو",
                alice: "آلیس",
                atom: "اتم",
                axs: "آکسی",
                bch: "بیت کوین کش",
                bnb: "بایننس کوین",
                btc: "بیت کوین",
                btt: "بیت تورنت",
                cake: "پنکیک‌سواپ",
                chz: "چیلیز",
                dash: "دش",
                doge: "دوج کوین",
                dot: "پولکادات",
                enj: "انجین",
                eos: "ایاس",
                eth: "اتریوم",
                fil: "فایل کوین",
                ftm: "فانتوم",
                link: "چین‌لینک",
                ltc: "لایت کوین",
                mana: " مانا",
                matic: "ماتیک",
                rune: "تورچین",
                sand: "سندباکس",
                shib: "شیبا",
                trx: "ترون",
                uni: "یونی سواپ",
                usdt: "تتر",
                xlm: "استلار",
                xrp: "ریپل",
                sol: "سولانا",
                dai: "دای",
                avax: "اوالانچ"
            }
        }
    },

    mounted() {
        this.fetch()
        this.interval = setInterval(() => {
            this.fetch()
        }, 10000);
        this.$axios.get('https://api.wallex.ir/v1/currencies/stats')
        .then(res => {
            let sag = [];
            res.data.result.map(c => {
                sag[c.key.toLowerCase()] = c.name
            });
            console.log(sag);
        })
    },
    
    beforeDestroy() {
        this.interval && clearInterval(this.interval)
    },

    methods: {
        fetch() {
            // this.loading = true
            this.$axios('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true')
            .then(res => {
                this.data = res.data
                // this.loading = false
            })
            .catch(err => {
                console.log(err);
            })
        },

        money(amount) {
            if (amount === null || amount === undefined || amount === '')
            return '';
            
            try {
                const thousands = "٫";
                const negativeSign = amount < 0 ? "-" : "";
                let i = (amount < 0 ? amount * -1 : amount) + "";
                let j = (i.length > 3) ? i.length % 3 : 0;
                return (negativeSign + (j ? i.slice(0, j) + thousands : '') + i.slice(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands));
            } catch (e) {
                return "NaN";
            }
        }
    }
}
</script>
<style lang="scss">
    .cryptomarket {
        &.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
            height: 80px;
        }
    }
</style>