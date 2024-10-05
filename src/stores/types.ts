export interface MenuOptions {
    path: string
    title: string
    icon?: string
    isLink?: string
    close?: boolean
    children?: MenuOptions[]
}

export interface MenuState {
    menuList: MenuOptions[]
    isCollapse: boolean
}