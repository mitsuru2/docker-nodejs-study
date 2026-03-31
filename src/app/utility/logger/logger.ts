import { inject, Injectable } from '@angular/core';
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
  private readonly className = 'Logger';

  // セッションID
  private readonly sessionId = uuid();

  // 依存サービス
  private readonly router = inject(Router);

  //----------------------------------------------------------------------------
  // 生成・消滅
  //
  constructor() {
    // SSR対応のため、静的プロパティによるシングルトン・ガードを削除しました。
    // AngularのDIにより、アプリケーションインスタンス（リクエスト）ごとに1つのインスタンスが生成されます。
  }

  //----------------------------------------------------------------------------
  // ロギングAPI
  //
  error(message: string | unknown) {
    const logMessage = this.makeLogMessage(LogLevel.Error, message);
    console.error(logMessage);
  }
  warn(message: string | unknown) {
    const logMessage = this.makeLogMessage(LogLevel.Warning, message);
    console.warn(logMessage);
  }
  info(message: string | unknown) {
    const logMessage = this.makeLogMessage(LogLevel.Info, message);
    console.info(logMessage);
  }
  debug(message: string | unknown) {
    const logMessage = this.makeLogMessage(LogLevel.Debug, message);
    console.debug(logMessage);
  }
  trace(message: string | unknown) {
    const logMessage = this.makeLogMessage(LogLevel.Trace, message);
    console.trace(logMessage);
  }

  /**
   * ログ出力用のフォーマット済みメッセージを作成します。
   *
   * @param level ログレベル
   * @param message メッセージ本文 (オブジェクトの場合はJSON文字列化されます)
   * @return 整形されたログメッセージ文字列
   */
  private makeLogMessage(level: LogLevel, message: string | unknown): string {
    // タイムスタンプ取得
    const timestamp = getTimestampText();

    // 表示画面取得
    const url = this.router?.url ?? '/';

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
    return `${timestamp} | ${this.sessionId} | ${url} | ${level} | ${textMessage}`;
  }
}
