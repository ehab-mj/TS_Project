import type { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setSelectedCategory, type PlaceCategory } from '../features/home/homeSlice'
import '../styles/CategoryFilterBar.css'

type Props = {
    mobileOpen: boolean
    onCloseMobile: () => void
}

type CategoryItem = {
    id: PlaceCategory
    label: string
    icon: ReactNode
}

const categories: CategoryItem[] = [
    {
        id: 'all',
        label: 'All',
        icon: <span className="category-pill__text-only"
        >All</span>
    },
    {
        id: 'plumber',
        label: 'Plumb',
        icon: <img src="/icons/water-tap.png" alt="" className="category-pill__image" />
    },
    {
        id: 'electrician',
        label: 'Electric',
        icon: <img src="/icons/electric.png" alt="" className="category-pill__image" />
    },
    {
        id: 'ac repair',
        label: 'AC',
        icon: <img src="/icons/ac.png" alt="" className="category-pill__image" />
    },
    {
        id: 'carpenter',
        label: 'Carp',
        icon: <img src="/icons/saw.png" alt="" className="category-pill__image" />
    },
    {
        id: 'cleaning services',
        label: 'Clean',
        icon: <img src="/icons/clean.png" alt="" className="category-pill__image" />
    },
    {
        id: 'repair service',
        label: 'repair',
        icon: <img src="/icons/repair.png" alt="" className="category-pill__image" />
    },
    {
        id: 'painting',
        label: 'painting',
        icon: <img src="/icons/paint.png" alt="" className="category-pill__image" />
    },
]

export default function CategoryFilterBar({ mobileOpen, onCloseMobile }: Props) {
    const dispatch = useAppDispatch()
    const selectedCategory = useAppSelector((state) => state.home.selectedCategory)

    const handleSelect = (categoryId: PlaceCategory) => {
        dispatch(setSelectedCategory(categoryId))
        onCloseMobile()
    }

    return (
        <>
            <div className="category-filter-bar">
                {categories.map((category) => {
                    const isActive = selectedCategory === category.id

                    return (
                        <button
                            key={category.id}
                            type="button"
                            className={`category-pill ${isActive ? 'category-pill--active' : ''}`}
                            onClick={() => dispatch(setSelectedCategory(category.id))}
                        >
                            {category.icon}
                            {category.id !== 'all' && (
                                <span className="category-pill__label">{category.label}</span>
                            )}
                        </button>
                    )
                })}
            </div>

            {mobileOpen && (
                <>
                    <button
                        type="button"
                        className="category-mobile-overlay"
                        onClick={onCloseMobile}
                        aria-label="Close category list"
                    />

                    <div className="category-mobile-sheet">
                        <div className="category-mobile-sheet__header">
                            <h3 className="category-mobile-sheet__title">Categories</h3>

                            <button
                                type="button"
                                className="category-mobile-sheet__close"
                                onClick={onCloseMobile}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="category-mobile-sheet__list">
                            {categories.map((category) => {
                                const isActive = selectedCategory === category.id

                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        className={`category-mobile-sheet__item ${isActive ? 'category-mobile-sheet__item--active' : ''}`}
                                        onClick={() => handleSelect(category.id)}
                                    >
                                        <span className="category-mobile-sheet__item-icon">
                                            {category.icon}
                                        </span>
                                        <span>{category.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}