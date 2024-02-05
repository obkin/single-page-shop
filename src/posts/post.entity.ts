class Post {
	constructor(
		private readonly _title: string,
		private readonly _body: string,
		private readonly _userId: number,
	) {}

	get title(): string {
		return this._title;
	}

	get body(): string {
		return this._body;
	}

	get userId(): number {
		return this._userId;
	}
}

export { Post };
