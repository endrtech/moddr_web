"use client";
import { useLoadingStore } from "@/lib/store/useLoadingStore";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loading() {
    const isLoading = useLoadingStore((state) => state.isLoading);
    const setLoading = useLoadingStore((state) => state.setLoading);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed inset-0 z-[99] flex items-center justify-center bg-black/80 backdrop-blur-sm text-white"
                >
                    <div className="flex flex-col gap-2 items-center">
                        <svg width="48" height="48" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="7.33" height="7.33"><animate id="spinner_oJFS" begin="0;spinner_5T1J.end+0.2s" attributeName="x" dur="0.6s" values="1;4;1" /><animate begin="0;spinner_5T1J.end+0.2s" attributeName="y" dur="0.6s" values="1;4;1" /><animate begin="0;spinner_5T1J.end+0.2s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" /><animate begin="0;spinner_5T1J.end+0.2s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" /></rect><rect x="8.33" y="1" width="7.33" height="7.33"><animate begin="spinner_oJFS.begin+0.1s" attributeName="x" dur="0.6s" values="8.33;11.33;8.33" /><animate begin="spinner_oJFS.begin+0.1s" attributeName="y" dur="0.6s" values="1;4;1" /><animate begin="spinner_oJFS.begin+0.1s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" /><animate begin="spinner_oJFS.begin+0.1s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" /></rect><rect x="1" y="8.33" width="7.33" height="7.33"><animate begin="spinner_oJFS.begin+0.1s" attributeName="x" dur="0.6s" values="1;4;1" /><animate begin="spinner_oJFS.begin+0.1s" attributeName="y" dur="0.6s" values="8.33;11.33;8.33" /><animate begin="spinner_oJFS.begin+0.1s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" /><animate begin="spinner_oJFS.begin+0.1s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" /></rect><rect x="15.66" y="1" width="7.33" height="7.33"><animate begin="spinner_oJFS.begin+0.2s" attributeName="x" dur="0.6s" values="15.66;18.66;15.66" /><animate begin="spinner_oJFS.begin+0.2s" attributeName="y" dur="0.6s" values="1;4;1" /><animate begin="spinner_oJFS.begin+0.2s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" /><animate begin="spinner_oJFS.begin+0.2s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" /></rect><rect x="8.33" y="8.33" width="7.33" height="7.33"><animate begin="spinner_oJFS.begin+0.2s" attributeName="x" dur="0.6s" values="8.33;11.33;8.33" /><animate begin="spinner_oJFS.begin+0.2s" attributeName="y" dur="0.6s" values="8.33;11.33;8.33" /><animate begin="spinner_oJFS.begin+0.2s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" /><animate begin="spinner_oJFS.begin+0.2s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" /></rect><rect x="1" y="15.66" width="7.33" height="7.33"><animate begin="spinner_oJFS.begin+0.2s" attributeName="x" dur="0.6s" values="1;4;1" /><animate begin="spinner_oJFS.begin+0.2s" attributeName="y" dur="0.6s" values="15.66;18.66;15.66" /><animate begin="spinner_oJFS.begin+0.2s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" /><animate begin="spinner_oJFS.begin+0.2s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" /></rect><rect x="15.66" y="8.33" width="7.33" height="7.33"><animate begin="spinner_oJFS.begin+0.3s" attributeName="x" dur="0.6s" values="15.66;18.66;15.66" /><animate begin="spinner_oJFS.begin+0.3s" attributeName="y" dur="0.6s" values="8.33;11.33;8.33" /><animate begin="spinner_oJFS.begin+0.3s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" /><animate begin="spinner_oJFS.begin+0.3s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" /></rect><rect x="8.33" y="15.66" width="7.33" height="7.33"><animate begin="spinner_oJFS.begin+0.3s" attributeName="x" dur="0.6s" values="8.33;11.33;8.33" /><animate begin="spinner_oJFS.begin+0.3s" attributeName="y" dur="0.6s" values="15.66;18.66;15.66" /><animate begin="spinner_oJFS.begin+0.3s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" /><animate begin="spinner_oJFS.begin+0.3s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" /></rect><rect x="15.66" y="15.66" width="7.33" height="7.33"><animate id="spinner_5T1J" begin="spinner_oJFS.begin+0.4s" attributeName="x" dur="0.6s" values="15.66;18.66;15.66" /><animate begin="spinner_oJFS.begin+0.4s" attributeName="y" dur="0.6s" values="15.66;18.66;15.66" /><animate begin="spinner_oJFS.begin+0.4s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" /><animate begin="spinner_oJFS.begin+0.4s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" /></rect></svg>
                        <span className="text-lg">Loading your dashboard...</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
