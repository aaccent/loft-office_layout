export const adaptive = {
    /**
     * Выявляет мобильное ли устройство или нет с помощью {@link matchMedia}
     * @return `true` если мобильное, иначе `false`
     * */
    get isMobile() {
        return matchMedia('(max-width: 1000px)').matches
    },
    /**
     * Выявляет десктоп или нет с помощью {@link matchMedia}
     * @return `true` если десктоп, иначе `false`
     * */
    get isDesktop() {
        return matchMedia('(min-width: 1200px)').matches
    },
}
