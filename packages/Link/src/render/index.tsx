import React from "react";
import { PbRenderElementPlugin } from "@webiny/app-page-builder/types";

import Link from "./components/link";

export default () =>
    ({
        name: "pb-render-page-element-link",
        type: "pb-render-page-element",
        elementType: "link",
        render({ element }) {
            return <Link element={element} />;
        }
    } as PbRenderElementPlugin);
