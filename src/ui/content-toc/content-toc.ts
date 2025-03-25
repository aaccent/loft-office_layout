function getCoords(element: HTMLElement) {
    const rect = element.getBoundingClientRect()
    return { x: rect.left + window.scrollX, y: rect.top + window.scrollY }
}

interface HeadingTocElement extends HTMLHeadingElement {
    tocListItem: HTMLElement
    isFirstItem: boolean
}

const intersectionObserver = new IntersectionObserver(
    (entries) => {
        console.log(entries)

        const entry = entries.at(-1)
        if (!entry) return

        const target = entry.target as HeadingTocElement

        if (entry.isIntersecting) {
            document.querySelector('.content-toc__list-item.active')?.classList.remove('active')
            target.tocListItem.classList.add('active')
        } else if (!target.isFirstItem && entry.intersectionRect.top !== 0) {
            document.querySelector('.content-toc__list-item.active')?.classList.remove('active')
            target.tocListItem.previousElementSibling?.classList.add('active')
        }
    },
    {
        root: null,
        rootMargin: '0% 0% -50% 0%',
        threshold: 1,
    },
)

void (function () {
    const tocList = document.querySelector('.content-toc__list')
    const PERCENT_15_WINDOW = window.innerWidth * 0.1

    if (!tocList) return

    const headings = document.querySelectorAll<HeadingTocElement>('.content-with-toc h2')
    headings.forEach((headingItem, index) => {
        intersectionObserver.observe(headingItem)

        const coords = getCoords(headingItem)
        const scrollToCoords = { left: 0, top: coords.y - PERCENT_15_WINDOW }

        const listItem = document.createElement('li')
        listItem.className = 'content-toc__list-item'
        headingItem.tocListItem = listItem
        headingItem.isFirstItem = index === 0

        const button = document.createElement('button')
        button.innerText = headingItem.innerText
        button.onclick = () => window.scrollTo(scrollToCoords)
        listItem.append(button)

        tocList.append(listItem)
    })
})()
