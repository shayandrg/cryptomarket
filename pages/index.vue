<template>
    <div>
        <div class="h-flex items-center justify-between my-10">
            <div class="h-flex">
                <v-icon dense>mdi-weather-night</v-icon>
                <v-switch inset :value="!$vuetify.theme.dark" @click="$vuetify.theme.dark = !$vuetify.theme.dark" />
                <v-icon dense>mdi-weather-sunny</v-icon>
            </div>
            <div>
                پایه قیمت
                <v-btn-toggle v-model="showCurrency" mandatory dense>
                    <v-btn>تومان</v-btn>
                    <v-btn>USDT</v-btn>
                </v-btn-toggle>
            </div>
        </div>
        <v-data-table :headers="headers" :items="data" :loading="loading" item-key="name" class="cryptomarket elevation-1">
            <template v-slot:item.favorite="{ item }">
                <div :class="{ 'en-num': showCurrency }">
                    <v-icon @click="weather-sunny">mdi-star</v-icon>
                </div>
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
        }
    },

    computed:{
        price() {
            return price => this.showCurrency ? `$${this.currency.format(price)}` : `${this.currency.format(price * 32000)} تومان`
        }
    },

    mounted() {
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