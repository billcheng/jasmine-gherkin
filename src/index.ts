enum Tag { Regular, Focus, Exclude }

type Then = {
  text: string;
  assert?: () => void;
  tag: Tag;
}

type When = {
  text: string;
  beforeEach: () => void | undefined;
  afterEach: () => void | undefined;
  thens: Then[];
  tag: Tag;
}

type Given = {
  text: string;
  beforeEach: () => void | undefined;
  afterEach: () => void | undefined;
  whens: When[];
  tag: Tag;
}

export class Tree {

  private _givens: Given[] = [];

  constructor(public text: string) { }

  get __case_givens(): Given[] {
    return this._givens;
  }

  private internal_given(text: string, tag: Tag, arrange?: () => void, cleanup?: () => void): Tree {
    this._givens.push({
      text,
      beforeEach: arrange,
      afterEach: cleanup,
      whens: [],
      tag
    });

    return this;
  }

  given(text: string, arrange?: () => void, cleanup?: () => void) {
    return this.internal_given(text, Tag.Regular, arrange, cleanup);
  }

  fgiven(text: string, arrange?: () => void, cleanup?: () => void) {
    return this.internal_given(text, Tag.Focus, arrange, cleanup);
  }

  xgiven(text: string, arrange?: () => void, cleanup?: () => void) {
    return this.internal_given(text, Tag.Exclude, arrange, cleanup);
  }

  private internal_and(text: string, tag: Tag, arrange?: () => void, cleanup?: () => void) {
    const last_given = this.getLastGiven();
    return this.internal_given(`${last_given.text} AND ${text}`, tag,

      (!!last_given.beforeEach || !!arrange) ? () => {

        if (!!last_given.beforeEach)
          last_given.beforeEach();

        if (!!arrange)
          arrange();

      } : undefined,

      (!!last_given.afterEach || !!cleanup) ? () => {
        if (!!last_given.afterEach)
          last_given.afterEach();

        if (!!cleanup)
          cleanup();
      } : undefined
    );
  }

  and(text: string, arrange?: () => void, cleanup?: () => void) {
    return this.internal_and(text, Tag.Regular, arrange, cleanup);
  }

  fand(text: string, arrange?: () => void, cleanup?: () => void) {
    return this.internal_and(text, Tag.Focus, arrange, cleanup);
  }

  xand(text: string, arrange?: () => void, cleanup?: () => void) {
    return this.internal_and(text, Tag.Exclude, arrange, cleanup);
  }

  private internal_when(text: string, tag: Tag, action?: () => void, cleanup?: () => void): Tree {

    const lastGiven = this.getLastGiven();

    lastGiven.whens.push({
      text,
      beforeEach: action,
      afterEach: cleanup,
      thens: [],
      tag
    });

    return this;
  }

  when(text: string, action?: () => void, cleanup?: () => void) {
    return this.internal_when(text, Tag.Regular, action, cleanup);
  }

  fwhen(text: string, action?: () => void, cleanup?: () => void) {
    return this.internal_when(text, Tag.Focus, action, cleanup);
  }

  xwhen(text: string, action?: () => void, cleanup?: () => void) {
    return this.internal_when(text, Tag.Exclude, action, cleanup);
  }

  private getLastGiven(): Given {
    if (this._givens.length === 0)
      throw new Error('No GIVEN defined before WHEN');

    return this._givens.slice(-1)[0];
  }

  private internal_then(text: string, tag: Tag, assert?: () => void): Tree {

    const lastWhen = this.getLastWhen();

    lastWhen.thens.push({
      text,
      assert,
      tag
    });

    return this;
  }

  then(text: string, assert?: () => void): Tree {
    return this.internal_then(text, Tag.Regular, assert);
  }

  fthen(text: string, assert?: () => void): Tree {
    return this.internal_then(text, Tag.Focus, assert);
  }

  xthen(text: string, assert?: () => void): Tree {
    return this.internal_then(text, Tag.Exclude, assert);
  }

  private getLastWhen(): When {
    const lastGiven = this.getLastGiven();

    if (lastGiven.whens.length === 0)
      throw new Error('No WHEN defined before THEN');

    return lastGiven.whens.slice(-1)[0];
  }

  private describes = {
    [Tag.Regular]: describe,
    [Tag.Focus]: fdescribe,
    [Tag.Exclude]: xdescribe
  };

  private its = {
    [Tag.Regular]: it,
    [Tag.Focus]: fit,
    [Tag.Exclude]: xit
  };

  private invoke_given(given: Given, describe: any) {

    if (given.whens.length > 0) {
      describe(`GIVEN ${given.text}`, () => {
        if (!!given.beforeEach)
          beforeEach(given.beforeEach);

        if (!!given.afterEach)
          afterEach(given.afterEach);

        given.whens.forEach(when =>
          this.invoke_when(when, this.describes[when.tag])
        )
      });
    }

  }

  private invoke_when(when: When, describe: any) {
    describe(`WHEN ${when.text}`, () => {
      if (!!when.beforeEach)
        beforeEach(when.beforeEach);

      if (!!when.afterEach)
        afterEach(when.afterEach);

      when.thens.forEach(then => this.invoke_then(then, this.its[then.tag]));
    });
  }

  private invoke_then(then: Then, it: any) {
    if (!!then.assert)
      it(`THEN ${then.text}`, then.assert);
    else
      it(`THEN ${then.text}`);
  }

  run() {
    describe(`Tests: ${this.text}`, () =>
      this._givens.forEach(given =>
        this.invoke_given(given, this.describes[given.tag])
      )
    )
  }

}

export const test = (text: string) => new Tree(text);