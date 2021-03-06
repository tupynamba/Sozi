/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** @module */

import {h} from "inferno-hyperscript";
import {VirtualDOMView} from "./VirtualDOMView";
import screenfull from "screenfull";
import pkg from "../../package.json";

/** Toolbar in the presentation editor.
 *
 * @extends module:view/VirtualDOMView.VirtualDOMView
 * @todo Add documentation.
 */
export class Toolbar extends VirtualDOMView {

    constructor(container, properties, presentation, viewport, controller) {
        super(container, controller);

        this.properties   = properties;
        this.presentation = presentation;
        this.viewport     = viewport;
    }

    render() {
        const thisView   = this;
        const controller = this.controller;
        const _          = controller.gettext;

        this.state["aspect-width"]  = {value: this.presentation.aspectWidth};
        this.state["aspect-height"] = {value: this.presentation.aspectHeight};

        return h("div", [
            h("span.group", [
                _("Aspect ratio: "),
                h("input.aspect", {
                    id: "field-aspect-width",
                    type: "number",
                    pattern: "\\d+",
                    min: "1",
                    step: "1",
                    size: "3",
                    onchange() {
                        const width = parseInt(this.value);
                        if (!width.isNaN) {
                            controller.setAspectWidth(width);
                        }
                    }
                }),
                " : ",
                h("input.aspect", {
                    id: "field-aspect-height",
                    type: "number",
                    pattern: "\\d+",
                    min: "1",
                    step: "1",
                    size: "3",
                    onchange() {
                        const height = parseInt(this.value);
                        if (!height.isNaN) {
                            controller.setAspectHeight(height);
                        }
                    }
                })
            ]),
            h("span.group.btn-group", [
                h("button", {
                    title: _("Move the selected layers (hold Alt to zoom, Shift to rotate)"),
                    className: this.viewport.dragMode === "translate" ? "active" : "",
                    onclick() { controller.setDragMode("translate"); }
                }, h("i.fas.fa-arrows-alt")),
                h("button", {
                    title: _("Zoom in/out on the selected layers (you can also hold the Alt key in Move mode)"),
                    className: this.viewport.dragMode === "scale" ? "active" : "",
                    onclick() { controller.setDragMode("scale"); }
                }, h("i.fas.fa-expand")),
                h("button", {
                    title: _("Rotate the selected layers (you can also hold the Shift key in Move mode)"),
                    className: this.viewport.dragMode === "rotate" ? "active" : "",
                    onclick() { controller.setDragMode("rotate"); }
                }, h("i.fas.fa-undo")), // "undo" icon shows a counter-clockwise circular arrow
                h("button", {
                    title: _("Edit the clipping area"),
                    className: this.viewport.dragMode === "clip" ? "active" : "",
                    onclick() { controller.setDragMode("clip"); }
                }, h("i.fas.fa-crop"))
            ]),
            h("span.group.btn-group", [
                h("button", {
                    title: _("Undo"),
                    disabled: controller.undoStack.length ? undefined : "disabled",
                    onclick() { controller.undo(); }
                }, h("i.fas.fa-reply")), // "reply" icon preferred to the official "undo" icon
                h("button", {
                    title: _("Redo"),
                    disabled: controller.redoStack.length ? undefined : "disabled",
                    onclick() { controller.redo(); }
                }, h("i.fas.fa-share")) // "share" icon preferred to the official "redo" icon
            ]),
            h("span.group", [
                h("button", {
                    title: screenfull.isFullscreen ? _("Disable full-screen mode") : _("Enable full-screen mode"),
                    id: "btn-fullscreen",
                    className: screenfull.isFullscreen ? "active" : undefined,
                    disabled: !screenfull.isEnabled,
                    onclick() { screenfull.toggle(document.documentElement).then(() => thisView.repaint()); }
                }, h("i.fas.fa-desktop"))
            ]),
            h("span.group.btn-group", [
                h("button", {
                    title: _("Save the presentation"),
                    disabled: controller.storage && controller.storage.htmlNeedsSaving ? undefined : "disabled",
                    onclick() { controller.save(); }
                }, h("i.fas.fa-download")), // "download" icon preferred to the official "save" icon
                h("button", {
                    title: _("Reload the SVG document"),
                    onclick() { controller.reload(); }
                }, h("i.fas.fa-sync"))
            ]),
            h("span.group.btn-group", [
                h("button", {
                    title: _("Preferences"),
                    className: this.properties.preferencesMode ? "active" : undefined,
                    onclick() { thisView.properties.togglePreferencesMode(); thisView.repaint(); }
                }, h("i.fas.fa-sliders-h")),
                h("button", {
                    title: _("Information"),
                    onclick() { controller.info(`Sozi ${pkg.version}`, true); }
                }, h("i.fas.fa-info"))
            ])
        ]);
    }
}
