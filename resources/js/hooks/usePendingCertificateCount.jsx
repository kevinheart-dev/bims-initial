import { useState, useEffect, useRef } from "react";
import axios from "axios";

const usePendingCertificateCount = () => {
    const [pendingCount, setPendingCount] = useState(0);
    const pendingCountFetchedRef = useRef(false);
    const pendingCountCacheKey = "pending-certificate-count";

    // Load cached count initially
    const cachedPendingCount = JSON.parse(
        localStorage.getItem(pendingCountCacheKey)
    );

    const fetchPendingCertificateCount = async () => {
        try {
            const res = await axios.get(
                `${APP_URL}/certificates/pending/count`
            );
            const apiCount = res.data.count;

            // Prepare cached data without timestamp
            let cachedDataWithoutTimestamp = cachedPendingCount
                ? { ...cachedPendingCount }
                : null;
            if (cachedDataWithoutTimestamp?._cachedAt) {
                delete cachedDataWithoutTimestamp._cachedAt;
            }

            // Compare old vs new
            const isDifferent =
                !cachedDataWithoutTimestamp ||
                cachedDataWithoutTimestamp.count !== apiCount;

            if (isDifferent) {
                // Update state
                setPendingCount(apiCount);

                // Save to cache with timestamp
                localStorage.setItem(
                    pendingCountCacheKey,
                    JSON.stringify({ count: apiCount, _cachedAt: Date.now() })
                );
            }

            pendingCountFetchedRef.current = true;
        } catch (err) {
            console.error("Failed to fetch pending certificate count:", err);
        }
    };

    // Fetch on mount if not already fetched
    useEffect(() => {
        if (!pendingCountFetchedRef.current) {
            fetchPendingCertificateCount();
        }
    }, []);

    return pendingCount;
};

export default usePendingCertificateCount;
