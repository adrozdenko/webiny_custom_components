import React from "react";
import { css } from "emotion";
import { ElementRoot } from "@webiny/app-page-builder/render/components/ElementRoot";

const outerWrapper = css({
    boxSizing: "border-box"
});

const innerWrapper = css({
    left: 0,
    width: "100%",
    height: "auto",
    position: "relative",
    paddingBottom: 0
});

const Link = ({ element }) => {
    const { data } = element;
    console.log(element);
    // If the user didn't enter a URL, let's show a simple message.
    if (!data.link.url) {
        return <a href="#">Link URL is missing.</a>;
    }

    // Otherwise, let's render the iframe.
    return (
        <ElementRoot
            className={
                "webiny-pb-base-page-element-style webiny-pb-page-element-embed-link " +
                outerWrapper
            }
            element={element}
        >
            <div className={innerWrapper}>
                <div id={data.id} />
                <a href={data.link.url}>{element.data.link.url}</a>
            </div>
        </ElementRoot>
    );
};

export default Link;
