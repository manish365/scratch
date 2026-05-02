import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import SnackBarAlert from './index';

const SnackBarWithRef = forwardRef((props, ref) => {
    const snackbarRef = useRef<SnackBarAlert | null>(null); // Refine the type

    useImperativeHandle(ref, () => ({
        showSnackBar: (message: any) => {
            if (snackbarRef.current) { // Check if snackbarRef is not null
                snackbarRef.current.showSnackBar(message);
            }
        },
    }));

    return <SnackBarAlert ref={snackbarRef} />;
});

export default SnackBarWithRef;