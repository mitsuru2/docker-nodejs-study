import { inject, Injectable, Injector } from '@angular/core';
import { uuid } from '../uuid/uuid';
import { Router } from '@angular/router';
import { getTimestampText } from '../timestamp/timestamp';

// ログレベル定義 (内部用)
enum LogLevel {
  Error = 'ERROR',
  Warning = 'WARN',
  Info = 'INFO',
  Debug = 'DEBUG',
  Trace = 'TRACE',
}

@Injectable({
  providedIn: 'root',
})
export class Logger {
  private static readonly className = 'Logger';

  // セッションID
  // サーバーにログデータを送信するようになった際にセッションを抽出できるようにするため。
  // 初期化フラグとしても利用。
  private static sessionId = '';

  // 依存サービス
  // private static ngxLogger?: any; // 将来拡張予定。
  private static router: Router; // ページURL取得のため。

  //----------------------------------------------------------------------------
  // 生成・消滅
  //
  constructor() {
    // 二重インスタンス生成のガード。
    // DIのためにコンストラクタ自体はpublicにする必要があるため。
    if (Logger.sessionId) {
      throw new Error("Logger is singleton class. Don't create instance.");
    }

    // セッションIDを設定。
    Logger.sessionId = uuid();

    // 依存サービスのインスタンスをコピー。
    const injector = inject(Injector);
    Logger.router = injector.get(Router);
  }

  //----------------------------------------------------------------------------
  // ロギングAPI
  //
  static error(message: string | unknown) {
    const logMessage = Logger.makeLogMessage(LogLevel.Error, message);
    console.error(logMessage);
  }
  static warn(message: string | unknown) {
    const logMessage = Logger.makeLogMessage(LogLevel.Warning, message);
    console.warn(logMessage);
  }
  static info(message: string | unknown) {
    const logMessage = Logger.makeLogMessage(LogLevel.Info, message);
    console.info(logMessage);
  }
  static debug(message: string | unknown) {
    const logMessage = Logger.makeLogMessage(LogLevel.Debug, message);
    console.debug(logMessage);
  }
  static trace(message: string | unknown) {
    const logMessage = Logger.makeLogMessage(LogLevel.Trace, message);
    console.trace(logMessage);
  }

  /**
   * ログ出力用のフォーマット済みメッセージを作成します。
   *
   * @param level ログレベル
   * @param message メッセージ本文 (オブジェクトの場合はJSON文字列化されます)
   * @return 整形されたログメッセージ文字列
   */
  private static makeLogMessage(level: LogLevel, message: string | unknown): string {
    // タイムスタンプ取得
    const timestamp = getTimestampText();

    // 表示画面取得
    const url = Logger.router?.url ?? '/';

    // messageの型に応じてテキストを作成。
    let textMessage: string;
    if (typeof message === 'string') {
      textMessage = message;
    } else if (typeof message === 'object') {
      try {
        textMessage = JSON.stringify(message);
      } catch {
        textMessage = '[Unserializable Object]';
      }
    } else {
      textMessage = String(message);
    }

    // ログレコードテキストを作成。
    return `${timestamp} | ${Logger.sessionId} | ${url} | ${level} | ${textMessage}`;
  }
}
