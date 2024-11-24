import dynamic from 'next/dynamic';

export const DynamicComponent = (url: string) => dynamic(() => import(url), {
    loading: () => <p>Loading...</p>,
})
