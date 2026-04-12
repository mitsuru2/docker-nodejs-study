export const i18nLabels = {
  common: {
    title: $localize`:@@common.title:Mitsuru Takahashi: 技術ポートフォリオ`,
    home: $localize`:@@common.home:ホーム`,
    skills: $localize`:@@common.skills:スキルセット`,
    career: $localize`:@@common.career:キャリア`,
    detail: $localize`:@@common.detail:詳細`,
  },
  skills: {
    diag: {
      title: $localize`:@@skills.diag.title:車両診断 & AUTOSAR`,
      subTitle: $localize`:@@skills.diag.subTitle:10年にわたる経験。車両診断技術のスペシャリスト`,
      description: $localize`:@@skills.diag.description:複数OEMにおける車両診断開発の10年以上の知見。AUTOSAR BSW/MCALのコンフィグレーションから通信プロトコルの実装まで、高い信頼性が求められる車載ドメインの要求に確実に応えます。`,
    },
    frontEnd: {
      title: $localize`:@@skills.frontEnd.title:フロントエンド開発`,
      subTitle: $localize`:@@skills.frontEnd.subTitle:Angularを軸とした、高度なUI/UXとモダンな開発の実現`,
      description: $localize`:@@skills.frontEnd.description:Angularリードエンジニアとして3年以上の実績。GUIライブラリにない独自の表現やアニメーションも開発可能です。Tauriを用いたデスクトップアプリの開発実績もございます。`,
    },
    ci: {
      title: $localize`:@@skills.ci.title:ワークフロー開発 & CI/CD`,
      subTitle: $localize`:@@skills.ci.subTitle:「止まらない開発」を支える、フルスクラッチの自動化基盤構築`,
      description: $localize`:@@skills.ci.description:Docker/GitHub/Azureを活用したビルド・テストの自動化。既存の外部システムと連携した複雑なワークフローの構築から、開発チーム全体の生産性を向上させる開発環境の整備まで一任いただけます。`,
    },
    systemDesign: {
      title: $localize`:@@skills.systemDesign.title:システムアーキテクチャー設計`,
      subTitle: $localize`:@@skills.systemDesign.subTitle:組み込みからWebアプリまで、堅牢性と保守性を両立する設計`,
      description: $localize`:@@skills.systemDesign.description:車載ECUシステムから中規模Webアプリまで、コンプライアンス要件 (セキュリティ・法規制) を厳守しつつ、長期間の運用に耐えうる拡張性の高い構造を定義します。`,
    },
    userReq: {
      title: $localize`:@@skills.userReq.title:要求分析 & ソリューション提案`,
      subTitle: $localize`:@@skills.userReq.subTitle:ビジネス要求を形にする、上流工程からの伴走型開発`,
      description: $localize`:@@skills.userReq.description:要件定義やロードマップ策定等の上流工程において、新規システム立ち上げを含む豊富な経験があります。プロダクトの背景や目的を深く理解した上で、技術的な実現可能性とビジネス要求をバランスよく調整し、プロジェクトを円滑に推進します。`,
    },
  },
  career: {
    experience: $localize`:@@common.experience:職務経歴`,
    qualification: $localize`:@@common.qualification:資格`,
    award: $localize`:@@common.award:表彰歴`,
    brief: $localize`:@@career.description:2009年から現在に至るまでの職務経歴と、主な担当業務について。`,
  },
} as const;
