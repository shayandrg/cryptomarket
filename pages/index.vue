<template>
    <div>
        <div class="h-flex items-center justify-between my-10">
            <div class="h-flex h-center">
                <v-icon dense>mdi-weather-night</v-icon>
                <v-switch inset class="mr-1" :value="!$vuetify.theme.dark" @click="$vuetify.theme.dark = !$vuetify.theme.dark" />
                <v-icon dense>mdi-weather-sunny</v-icon>
                <v-btn-toggle class="mr-5" v-model="cryptoShow" mandatory dense>
                    <v-btn rounded value="hits">داغ ترین ها</v-btn>
                    <v-btn rounded value="favorites">منتخب من</v-btn>
                </v-btn-toggle>
            </div>
            <div>
                پایه قیمت
                <v-btn-toggle class="mr-1" v-model="showCurrency" mandatory dense>
                    <v-btn>تومان</v-btn>
                    <v-btn>USDT</v-btn>
                </v-btn-toggle>
            </div>
        </div>
        <v-data-table :headers="headers" :items="itemsToShow" :loading="loading || !data.length" loading-text="در حال دریافت داده ها..." item-key="name" class="cryptomarket elevation-1">
            <template v-slot:item.favorite="{ item }">
                <v-icon :color="favorites.indexOf(item.symbol) !== -1 ? 'amber' : 'grey'" @click="favorite(item.symbol)">{{ favorites.indexOf(item.symbol) !== -1 ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
            </template>
            <template v-slot:item.current_price="{ item }">
                <div :class="{ 'en-num': showCurrency }">
                    {{ price(item.current_price) }}
                </div>
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
            <template v-slot:item.price_change_percentage_24h="{ item }">
                <div :class="item.price_change_percentage_24h < 0 ? 'red--text text--accent-2' : 'teal--text text--accent-3'" class="percent">
                    {{ `${item.price_change_percentage_24h > 0 ? '+' : ''}${item.price_change_percentage_24h.toFixed(2)}%` }}
                </div>
            </template>
            <template v-slot:item.total_volume="{ item }">
                <div :class="{ 'en-num': showCurrency }">
                    {{ price(item.total_volume) }}
                </div>
            </template>
            <template v-slot:item.sparkline_in_7d="{ item }">
                <v-sparkline auto-draw :value="item.sparkline_in_7d.price" :color="item.price_change_percentage_7d_in_currency < 0 ? 'red accent-2' : 'teal accent-3'" line-width="3" />
            </template>
            <template v-slot:no-data>
                <div>
                    <div v-if="cryptoShow == 'favorites'" class="py-32" :class="{ 'white--text': $vuetify.theme.dark, 'grey--text text--darken-2': !$vuetify.theme.dark }">
                        <v-btn fab :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3'" elevation="0" width="100" height="100"><v-icon color="amber" size="72">mdi-star</v-icon></v-btn>
                        <div class="my-7 font-bold text-2xl ">لیست منتخب شما خالی است.</div>
                        <div>ارز های منتخبتان را با زدن روی <v-icon>mdi-star-outline</v-icon> می‌توانید به این لیست اضافه کنید.</div>
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
                { text: '', value: 'favorite', width: 20 },
                { text: '#', value: 'market_cap_rank', width: 20 },
                { text: 'ارز دیجیتال', value: 'name' },
                { text: 'قیمت', value: 'current_price' },
                { text: 'تغییرات (24h)', value: 'price_change_percentage_24h' },
                { text: 'حجم معاملات (24h)', value: 'total_volume' },
                { text: 'نمودار هفتگی', value: 'sparkline_in_7d' },
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
            },
            showCurrency: 0,
            currency: Intl.NumberFormat('en-US'),
            favorites: [],
            cryptoShow: 'hits'
        }
    },

    computed:{
        price() {
            return price => this.showCurrency ? `$${this.currency.format(price)}` : `${this.currency.format(price * 32000)} تومان`
        },
        itemsToShow() {
            if (this.cryptoShow == 'favorites') {
                return this.data.filter(coin => this.favorites.indexOf(coin.symbol) !== -1)
            }
            return this.data
        }
    },

    mounted() {
        this.favorite()
        this.fetch()
        this.interval = setInterval(() => {
            this.fetch()
        }, 15000);
    },
    
    beforeDestroy() {
        this.interval && clearInterval(this.interval)
    },

    methods: {
        fetch() {
            // this.loading = true
            this.$axios('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h,7d')
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
        },

        favorite(symbol = null) {
            var item = localStorage.getItem("favorites")
            if (item === undefined || item === null) {
                localStorage.setItem("favorites", JSON.stringify([]));
                item = localStorage.getItem("favorites")
            }
            item = JSON.parse(item)
            if (symbol !== null) {
                let index = item.indexOf(symbol)
                index !== -1 ? item.splice(index, 1) : item.push(symbol)
            }
            this.favorites = item
            localStorage.setItem("favorites", JSON.stringify(item))
        }
    }
}
</script>
<style lang="scss">
    .cryptomarket {
            font-variation-settings: 'wght' 300;
        &.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
            height: 80px;
        }
        .percent {
            font-variation-settings: 'wght' 500;
            direction: ltr;
            text-align: right;
        }
    }
</style>