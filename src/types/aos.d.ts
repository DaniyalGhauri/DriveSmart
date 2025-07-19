declare module 'aos' {
    const aos: {
        init: (options?: {
            duration?: number;
            once?: boolean;
        }) => void;
    };
    export default aos;
} 