class Post {
	constructor(
		private readonly _title: string,
		private readonly _body: string,
	) {}

	get title(): string {
		return this._title;
	}

	get body(): string {
		return this._body;
	}
}

export { Post };
