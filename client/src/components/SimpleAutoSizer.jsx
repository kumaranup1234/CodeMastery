
import React, { useState, useEffect, useRef } from 'react';

const SimpleAutoSizer = ({ children }) => {
    const parentRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!parentRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                // Only update if dimensions actually changed to avoid loops
                if (width !== size.width || height !== size.height) {
                    setSize({ width, height });
                }
            }
        });

        observer.observe(parentRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={parentRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            {size.width > 0 && size.height > 0 && children(size)}
        </div>
    );
};

export default SimpleAutoSizer;
