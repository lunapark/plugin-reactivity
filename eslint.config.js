import lpConfigVue from "@luna-park/eslint-config/vue";
import lunaParkPlugin from "@luna-park/plugin/eslint";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["**/dist/*"]
    },
    ...lpConfigVue,
    lunaParkPlugin
);
