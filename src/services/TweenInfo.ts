import {
    EasingStyle,
    EasingDirection
} from "./Enums";

export class TweenInfo {
    constructor(
        public duration: number,
        public easingStyle: EasingStyle,
        public easingDirection: EasingDirection
    ) {}
}