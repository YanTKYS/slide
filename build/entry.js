// iSlide のバンドル用エントリポイント。
// @marp-team/marp-core をブラウザのグローバル (window.iSlideMarpCore) へ公開するだけの薄い層。
// バンドル結果は assets/marp-core.bundle.js としてリポジトリへ同梱する。
import { Marp } from '@marp-team/marp-core';

window.iSlideMarpCore = { Marp };
